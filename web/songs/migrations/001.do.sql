CREATE TABLE IF NOT EXISTS songs (
  id VARCHAR NOT NULL PRIMARY KEY,
  title VARCHAR NOT NULL,
  singer_id VARCHAR,
  year INT
);
