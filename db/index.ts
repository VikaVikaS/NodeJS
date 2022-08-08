import Database from 'sqlite-async';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, 'users.db');
const DB_SQL_PATH = path.join(__dirname, 'db-schema.sql');

let db;

async function initDB() {
  try {
    const _db = await Database.open(DB_PATH);
    db = _db;

    const initSQL = fs.readFileSync(DB_SQL_PATH, 'utf-8');
    await db.exec(initSQL);
  } catch (e) {
    throw new Error(e);
  }
}

export { db, initDB };
