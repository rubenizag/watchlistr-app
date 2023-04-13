DROP DATABASE IF EXISTS watchlistr_db;
CREATE DATABASE watchlistr_db;
\c watchlistr_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER,
  title TEXT NOT NULL,
  runtime INTEGER,
  release_date TEXT,
  poster_path VARCHAR(200),
  overview TEXT
);

CREATE TABLE tv_shows (
  id SERIAL PRIMARY KEY,
  tv_show_id INTEGER,
  name TEXT NOT NULL,
  runtime INTEGER,
  air_dates TEXT,
  poster_path VARCHAR(200),
  overview TEXT
);

CREATE TABLE user_watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  movie_id INTEGER REFERENCES movies(id),
  tv_show_id INTEGER REFERENCES tv_shows(id),
  CONSTRAINT user_movie_unique UNIQUE (user_id, movie_id, tv_show_id)
);

INSERT INTO users (username, password) VALUES ('test', crypt('test', gen_salt('bf')));