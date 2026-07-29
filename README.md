# Company Monorepo

This repository is organized as a Bun + Turborepo workspace.

## Workspaces

- `web` - public Vite React frontend.
- `web/server` - Express static server for the built web frontend.
- `admin` - admin Vite React frontend.
- `admin/server` - Express static server for the built admin frontend.
- `server` - main API server.

## Install

```sh
bun install
```

## First-Time Setup

1. Create environment files from the examples:

```sh
cp server/.env.example server/.env
cp admin/.env.example admin/.env
cp web/.env.example web/.env
cp admin/server/.env.example admin/server/.env
cp web/server/.env.example web/server/.env
```

2. Update `server/.env` for your MongoDB database.

For local MongoDB:

```sh
DEV_DATABASE_URL=mongodb://127.0.0.1:27017/right-code
DATABASE_URL=mongodb://127.0.0.1:27017/right-code
```

For MongoDB Atlas, use your Atlas connection string for both database variables, or keep `DEV_DATABASE_URL` local and `DATABASE_URL` for production.

3. Update the required secrets in `server/.env`:

```sh
SECRET=replace-with-a-long-random-jwt-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
ADMIN_NAME=Right Code Admin
```

Mail variables are only needed for email sending:

```sh
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password
EMAIL_FORM=your-email@gmail.com
```

4. Update frontend API URLs if needed.

The default local API is `http://localhost:5000/api`. The admin app uses `VITE_DEV_URL` and `VITE_PROD_URL`; the public web app uses `VITE_API_URL`.

5. Push the Prisma schema to MongoDB:

```sh
bun run db:push
```

6. Seed the database for the first time:

```sh
bun run db:seed
```

This seeds base CMS content, pages, route sections, home content, and the admin account.

7. Run the project in development:

```sh
bun run dev
```

This starts the API server, public web app, and admin app together. The API should be available on `http://localhost:5000` when `PORT=5000`.

For a clean local reset later:

```sh
bun run db:reset
```

This clears app data, pushes the schema, and seeds again.

## Main Commands

```sh
bun run build
```

Builds `web` and `admin`. Each app first writes its normal Vite output to `dist`, then stages that output into its server package:

- `web/dist` -> `web/server/dist`
- `admin/dist` -> `admin/server/dist`

```sh
bun run build:all
```

Builds every workspace that has a `build` script, including the API server.

```sh
bun run dev
```

Runs the Vite web app, Vite admin app, and API development server in parallel.

```sh
bun run dev:web
bun run dev:admin
bun run dev:api
```

Runs one development target.

```sh
bun run dev:sites
```

Runs the web and admin static server packages in watch mode.

```sh
bun run start:web
bun run start:admin
bun run start:api
```

Starts one production-style server package.

```sh
bun run start:sites
```

Starts the web and admin static servers together.

## Database Commands

The API database is MongoDB through Prisma. `db:push` syncs the Prisma schema to MongoDB; there are no SQL migrations in this project.

```sh
bun run db:push
```

Pushes the Prisma schema for the API server database.

```sh
bun run db:seed
bun run seed
```

Runs all API seeders. The current seed order is content, pages, routes, home, then admin.

```sh
bun run db:clear
```

Clears application data using `server/seeders/clear-db.seeder.ts`.

```sh
bun run db:reset
```

Clears the database, pushes the Prisma schema, then runs all seeders.

## Ports

- `web/server` defaults to `3001`.
- `admin/server` defaults to `3002`.
- `server` uses its own server configuration.

Set `PORT` to override a static server port. Set `API_URL` to point the static servers at the API backend; it defaults to `http://localhost:5000`.

## Turbo Layout

`turbo.json` caches deterministic tasks such as `build`, `build:app`, `stage`, `lint`, and `typecheck`. Long-running, writing, or environment-changing tasks such as `dev`, `start`, `format`, database commands, Prisma Studio, and seed scripts are uncached.
