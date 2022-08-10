CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, 
  username TEXT
);

CREATE TABLE IF NOT EXISTS exercises (
  _id TEXT, 
  exerciseId TEXT PRIMARY KEY, 
  description TEXT, 
  duration INTEGER, 
  date TEXT
)