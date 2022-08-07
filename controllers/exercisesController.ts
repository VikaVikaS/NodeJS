import express from 'express';
import Database from 'sqlite-async';
import { format, add } from 'date-fns';
import { CreatedExerciseResponse, UserExerciseLog } from '../models/Exercise';
import { getCurrentUser } from './userController';
import { DB_PATH_EXERCISES, ERRORS_LIST } from '../constants';

async function createNewExercise(req: express.Request, res: express.Responses) {
  if (req.method !== 'POST') {
    return res
      .status(ERRORS_LIST.INVALID_REQUEST.statusCode)
      .send(ERRORS_LIST.INVALID_REQUEST);
  }

  if (!req.body._id) {
    return res.status(400).send(ERRORS_LIST.MISSED_FIELD('User id'));
  }

  if (!req.body.description) {
    return res.status(400).send(ERRORS_LIST.MISSED_FIELD('Description'));
  }

  if (!req.body.duration) {
    return res.status(400).send(ERRORS_LIST.MISSED_FIELD('Duration'));
  }

  try {
    const parsedDate = req.body.date
    ? format(new Date(req.body.date), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

    const data = {
      _id: Number(req.body._id),
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

    const db = await Database.open(DB_PATH_EXERCISES);
    await db.run(
      'CREATE TABLE IF NOT EXISTS exercises(_id, description, duration, date)',
    );
    await db.run(
      `INSERT INTO exercises(_id, description, duration, date) 
      VALUES 
        (?, ?, ?, ?)`,
      data._id,
      data.description,
      data.duration,
      data.date,
    );

    const response = {
      userId: data._id,
      exerciseId: 0,
      duration: data.duration,
      description: data.description,
      date: data.date,
    } as CreatedExerciseResponse;

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
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
    const userData = await getCurrentUser(Number(req.params._id));

    if (!userData) {
      return res
        .status(ERRORS_LIST.NOT_FOUND.statusCode)
        .send(ERRORS_LIST.NOT_FOUND);
    }

    const id = Number(req.params._id);
    const { from, to, limit = 1000 } = req.query;

    const fromDate = from || '';
    const toDate = to ? to : format(add(new Date(), { years: 100 }), 'yyyy-MM-dd');

    const db = await Database.open(DB_PATH_EXERCISES);
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
        date > ? AND
        date < ?
      LIMIT ${limit}
      `,
      id,
      fromDate,
      toDate,
    );

    await db.close();

    const response = {
      ...userData,
      count: totalAmount['count(*)'],
      logs: exercises,
    } as UserExerciseLog;

    return res.status(200).json(response);
  } catch (e) {
    return res
      .status(ERRORS_LIST.INTERNAL_ERROR.statusCode)
      .send(ERRORS_LIST.INTERNAL_ERROR);
  }
}

export { createNewExercise, getLogs };
