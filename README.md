# Store Rating System

A full-stack web app where Admins, Users, and Store Owners share a single login, with role-based dashboards for managing stores, submitting ratings, and tracking performance.

## Stack
- **Backend**: Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, express-validator
- **Frontend**: React, Vite, TypeScript, React Router, Axios, React Hook Form, Zod, Tailwind CSS, TanStack Table, React Hot Toast

## Project structure
```
store-rating-system/
├── backend/    Express API — see backend/README.md
└── frontend/   React SPA — see frontend/README.md
```

## Quick start

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
docker compose up -d          # starts local Postgres
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed           # creates the admin account
npm run dev                   # http://localhost:5000

# 2. Frontend (in a second terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                   # http://localhost:5173
```

Then log in at http://localhost:5173/login with the seeded admin:
- **Email**: `admin@storerating.com`
- **Password**: `Admin@12345`

(Both values come from `backend/.env` — change them before deploying anywhere real.)

## Roles at a glance
| Role | Can do |
|---|---|
| **Admin** | Dashboard (user/store/rating counts), create users/admins/store owners/stores, browse & search all users and stores, view user details (incl. store owner's average rating) |
| **User** | Sign up, browse/search/sort stores, submit or update a 1–5 star rating per store, change password |
| **Store Owner** | Dashboard with average rating, total ratings, and the list of users who rated their store; change password |

See `backend/README.md` for the full API reference and `frontend/README.md` for the frontend architecture.
