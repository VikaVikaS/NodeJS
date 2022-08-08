import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';

import { ERRORS_LIST } from '../constants';
import { db } from '../db';

export async function getCurrentUser(id: number) {
  try {
    const user = await db.get(
      `
      SELECT
        *
      FROM
        users
      WHERE
        id = ?
      `,
      id,
    );

    return Promise.resolve(user || false);
  } catch (e) {
    return Promise.resolve(false);
  }
}

async function getAllUsers(req: express.Request, res: express.Response) {
  if (req.method !== 'GET') {
    return res
      .status(ERRORS_LIST.INVALID_REQUEST.statusCode)
      .send(ERRORS_LIST.INVALID_REQUEST);
  }

  try {
    const allUsers = await db.all(
      `
      SELECT *
      FROM
        users
      `,
    );

    if (!allUsers.length) {
      return res
        .status(ERRORS_LIST.NOT_FOUND.statusCode)
        .send(ERRORS_LIST.NOT_FOUND);
    }

    return res.status(200).json(allUsers);
  } catch (e) {
    return res
      .status(ERRORS_LIST.NOT_FOUND.statusCode)
      .send(ERRORS_LIST.NOT_FOUND);
  }
}

async function createNewUser(req: express.Request, res: express.Response) {
  if (!req.body || !req.body.username) {
    return res
      .status(ERRORS_LIST.INVALID_REQUEST.statusCode)
      .send(ERRORS_LIST.INVALID_REQUEST);
  }

  try {
    const username = req.body.username;

    const isUserNameExists = await db.get(
      `
      SELECT
        *
      FROM
        users
      WHERE
        username = ?
      `,
      username,
    );

    if (isUserNameExists) {
      return res
        .status(ERRORS_LIST.ALREADY_EXISTS.statusCode)
        .send(ERRORS_LIST.ALREADY_EXISTS);
    }

    const userData = {
      id: uuidv4(),
      username,
    } as User;

    await db.run(
      `
      INSERT INTO 
        users(id, username) 
      VALUES 
        (?, ?)`,
      userData.id,
      userData.username,
    );

    return res.status(200).json(userData);
  } catch (e) {
    return res
      .status(ERRORS_LIST.INTERNAL_ERROR.statusCode)
      .send(ERRORS_LIST.INTERNAL_ERROR);
  }
}

export { getAllUsers, createNewUser };
