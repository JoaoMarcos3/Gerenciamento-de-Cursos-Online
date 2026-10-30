# Online Course Management

Starter API for the Online Course Management academic project. The API uses Node.js, TypeScript, Express, and PostgreSQL on Supabase.

## Requirements

- Node.js 20 or later and npm
- A Supabase project with its PostgreSQL connection string

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to the connection string from Supabase. Keep the password private. Set `DB_SSL=true` when using the Supabase hosted database.
4. In the Supabase SQL Editor, run [`database/migrations/001_create_initial_schema.sql`](database/migrations/001_create_initial_schema.sql).

## Run

- Development with automatic restart: `npm run dev`
- Compile TypeScript: `npm run build`
- Run the compiled server: `npm start`

The API listens on port 3000 by default. Set `PORT` in `.env` to change it.

## Health check

Start the server and request `GET http://localhost:3000/api/health`. It returns HTTP 200 and `{"status":"ok"}`. For example:

```sh
curl http://localhost:3000/api/health
```

This endpoint checks that the API process is responding; it does not query the database.

## Project structure

```text
src/
  config/          Environment configuration
  controllers/     HTTP request handlers
  database/        PostgreSQL connection pool
  middlewares/     Express middleware
  repositories/    Database access
  routes/          API route definitions
  services/        Application logic
  app.ts           Express application
  server.ts        HTTP server entry point
database/
  migrations/      SQL schema migrations
docs/              Project documentation and ER diagram
```

CRUD endpoints are intentionally left for the feature owners.

## Initial team task split

- João: project setup, architecture, database schema, and health endpoint.
- Augusto: user-related CRUD.
- Thiago: course and module CRUD.
- Daniel: content and user progress CRUD.

Coordinate ownership and API contracts in the shared repository before implementing overlapping changes.

## First GitHub commit and push

Create an empty GitHub repository, then run these commands from the project directory (replace the URL with your repository URL):

```sh
git add .
git commit -m "chore: initialize online course management API"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

Never commit `.env`; credentials belong in local environment variables or an approved secrets manager.
