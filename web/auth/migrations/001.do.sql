CREATE TABLE IF NOT EXISTS accounts (
  "id" INTEGER NOT NULL PRIMARY KEY,
  "email" VARCHAR(320) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  "id" INTEGER NOT NULL PRIMARY KEY,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "account_id" INTEGER NOT NULL REFERENCES accounts(id)
);
