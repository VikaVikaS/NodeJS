CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, 
  username TEXT
);

CREATE TABLE IF NOT EXISTS exercises (
  _id TEXT PRIMARY KEY, 
  exerciseId TEXT, 
  description TEXT, 
  duration INTEGER, 
  date TEXT
)