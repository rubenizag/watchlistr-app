#!/bin/bash

# Set the name of your database
DB_NAME="watchlistr_db"

# Create the database if it doesn't exist
psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -c "CREATE DATABASE $DB_NAME;"
# psql -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

# Connect to the database
psql -d $DB_NAME -c "DROP TABLE IF EXISTS users;"
psql -d $DB_NAME -f data.sql