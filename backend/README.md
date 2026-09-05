# Store Rating System — Backend

Express + TypeScript + Prisma + PostgreSQL REST API for the Store Rating System.

## Stack

Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, express-validator, Helmet, CORS, express-rate-limit.

## Getting started

```bash
npm install
cp .env.example .env

# Option A: use Docker for Postgres
docker compose up -d

npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

npm run dev                 # http://localhost:5000
```

Default seeded admin (override via `.env`):

- email: `admin@storerating.com`
- password: `Admin@12345`

## Scripts

| Script                          | Purpose                                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| `npm run dev`                   | Start with hot-reload (nodemon + ts-node)                             |
| `npm run build`                 | Compile TypeScript to `dist/`                                         |
| `npm start`                     | Run the compiled build                                                |
| `npm run prisma:generate`       | Generate the Prisma Client                                            |
| `npm run prisma:migrate`        | Create + apply a new migration (dev)                                  |
| `npm run prisma:migrate:deploy` | Apply existing migrations (CI/prod)                                   |
| `npm run prisma:seed`           | Seed the admin account                                                |
| `npm test`                      | Run the Jest test suite (34 tests, no DB required — Prisma is mocked) |

## API overview

All responses share the shape `{ success, message, data, meta? }`; errors add `errors` (validation) or omit `data`.

| Method | Path                          | Auth                            | Description                                                        |
| ------ | ----------------------------- | ------------------------------- | ------------------------------------------------------------------ |
| POST   | `/api/auth/signup`            | Public                          | Register a new USER account                                        |
| POST   | `/api/auth/login`             | Public                          | Log in (any role)                                                  |
| POST   | `/api/auth/refresh`           | Public (refresh token)          | Exchange a refresh token for a new access token                    |
| POST   | `/api/auth/logout`            | Bearer                          | Stateless logout                                                   |
| POST   | `/api/auth/change-password`   | Bearer                          | Change your own password                                           |
| GET    | `/api/auth/me`                | Bearer                          | Current user's profile                                             |
| POST   | `/api/users`                  | ADMIN                           | Create a user/admin/store owner                                    |
| GET    | `/api/users`                  | ADMIN                           | List users (search, sort, paginate, filter by role)                |
| GET    | `/api/users/:id`              | ADMIN                           | User details (+ store avg rating if STORE_OWNER)                   |
| POST   | `/api/stores`                 | ADMIN                           | Create a store                                                     |
| GET    | `/api/stores`                 | Bearer                          | List stores (search, sort, paginate; includes `myRating` for USER) |
| GET    | `/api/stores/:id`             | Bearer                          | Store details                                                      |
| POST   | `/api/ratings`                | USER                            | Submit or update your rating for a store                           |
| GET    | `/api/ratings/store/:storeId` | STORE_OWNER (own store) / ADMIN | List users who rated a store                                       |
| GET    | `/api/dashboard/admin`        | ADMIN                           | Total users/stores/ratings                                         |
| GET    | `/api/dashboard/store-owner`  | STORE_OWNER                     | Average rating, total ratings, per-store breakdown                 |

## Validation rules (enforced both server- and client-side)

- Name: 20–60 characters
- Address: max 400 characters
- Password: 8–16 characters, ≥1 uppercase, ≥1 special character
- Email: standard email format
- Rating: integer 1–5

## Security

Helmet, CORS (locked to `CLIENT_URL`), rate limiting, `xss-clean` sanitization, bcrypt password hashing, JWT access + refresh tokens, role-based route authorization, a global error handler that maps Prisma errors (duplicate email → 409, missing record → 404, etc.) to safe client-facing messages.
