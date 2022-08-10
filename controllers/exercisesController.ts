import express from 'express';
import { format, add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  Exercise,
  CreatedExerciseResponse,
  UserExerciseLog,
} from '../models/Exercise';
import { getCurrentUser } from './userController';
import { ERRORS_LIST } from '../constants';
import { db } from '../db';

async function createNewExercise(req: express.Request, res: express.Responses) {
  if (req.method !== 'POST') {
    return res
      .status(ERRORS_LIST.INVALID_REQUEST.statusCode)
      .send(ERRORS_LIST.INVALID_REQUEST);
  }

  if (!req.body._id) {
    const error = ERRORS_LIST.MISSED_FIELD('User id');
    return res.status(error.statusCode).send(error);
  }

  if (!req.body.description) {
    const error = ERRORS_LIST.MISSED_FIELD('Description');
    return res.status(error.statusCode).send(error);
  }

  if (!req.body.duration) {
    const error = ERRORS_LIST.MISSED_FIELD('Duration');
    return res.status(error.statusCode).send(error);
  }

  try {
    const parsedDate = req.body.date
      ? format(new Date(req.body.date), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');

    const data = {
      _id: req.body._id,
      exerciseId: uuidv4(),
      description: req.body.description,
      duration: Number(req.body.duration),
      date: parsedDate,
    };

    const isUserExists = await getCurrentUser(data._id);

    if (!isUserExists) {
      return res
        .status(ERRORS_LIST.NOT_FOUND.statusCode)
        .send(ERRORS_LIST.NOT_FOUND);
    }

    await db.run(
      `INSERT INTO exercises(_id, exerciseId, description, duration, date) 
      VALUES 
        (?, ?, ?, ?, ?)`,
      data._id,
      data.exerciseId,
      data.description,
      data.duration,
      data.date,
    );

    const response = {
      userId: data._id,
      exerciseId: data.exerciseId,
      duration: data.duration,
      description: data.description,
      date: data.date,
    } as CreatedExerciseResponse;

    return res.status(200).json(response);
  } catch (e) {
    return res
      .status(ERRORS_LIST.INTERNAL_ERROR.statusCode)
      .send(ERRORS_LIST.INTERNAL_ERROR);
  }
}

async function getLogs(req: express.Request, res: express.Responses) {
  if (req.method !== 'GET') {
    return res
      .status(ERRORS_LIST.INVALID_REQUEST.statusCode)
      .send(ERRORS_LIST.INVALID_REQUEST);
  }

  try {
    const userData = await getCurrentUser(req.params._id);

    if (!userData) {
      return res
        .status(ERRORS_LIST.NOT_FOUND.statusCode)
        .send(ERRORS_LIST.NOT_FOUND);
    }

    const id = req.params._id;
    const { from, to, limit = 100000 } = req.query;

    const fromDate = from || '';
    const toDate = to
      ? to
      : format(add(new Date(), { years: 100 }), 'yyyy-MM-dd');

    const totalAmount = await db.get(
      `
      SELECT
        count(*)
      FROM
        exercises
      WHERE
        _id = ?
      `,
      id,
    );

    const exercises = await db.all(
      `
      SELECT
        *
      FROM
        exercises
      WHERE
        _id = ? AND
        date >= ? AND
        date <= ?
      ORDER BY date ASC
      LIMIT ${limit}
      `,
      id,
      fromDate,
      toDate,
    );

    const mappedExercises = exercises.map(
      (i: CreatedExerciseResponse) =>
        ({
          id: i.exerciseId,
          description: i.description,
          duration: i.duration,
          date: i.date,
        } as Exercise),
    );

    const response = {
      ...userData,
      count: totalAmount['count(*)'],
      logs: mappedExercises,
    } as UserExerciseLog;

    return res.status(200).json(response);
  } catch (e) {
    return res
      .status(ERRORS_LIST.INTERNAL_ERROR.statusCode)
      .send(ERRORS_LIST.INTERNAL_ERROR);
  }
}

export { createNewExercise, getLogs };
