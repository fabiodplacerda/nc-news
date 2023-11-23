# Northcoders News API

Northcoders News API is a project with the intention of mimicking the building of a real-world backend service (such as Reddit), aiming to provide similar functionality and features.

## Creating the databases

You must create two .env files for your project: .env.test and .env.development.

Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

#### For example:

```javascript
//development
PGDATABASE = database_name;

//test
PGDATABASE = database_name_test;
```

Double-check that these .env files are .gitignored.

At this point in your terminal, you should run the following command:

```bash
npm install
```

This will install:

Dotenv, Express, and pg

### Setting up the database

The following command should create a test DB and a development DB in your local machine

```bash
npm run setup-dbs
```

### Seeding the data

The following command is going to seed the data into your local machine

```bash
npm run seed
```

### Testing

Make sure you install jest and Supertest as dev dependencies to run the tests

The following command will run the test for the endpoints

```bash
npm test __test__/integration.js
```
