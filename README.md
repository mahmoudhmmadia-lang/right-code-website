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
