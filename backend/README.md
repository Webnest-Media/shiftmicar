# Shift My Car Blog API

Separate Node.js + Express + Prisma + PostgreSQL backend for the Blog CMS.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, URLs.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Run migrations: `npm run prisma:migrate` (or `npm run db:push` for local prototyping)
5. Seed admin user: `npm run prisma:seed`
6. Start API: `npm run dev`

Default CMS admin is seeded into the `users` table (not env):
`admin@shiftmycar.com` / `ChangeMe123!`

## Scripts

- `npm run dev` — start API with hot reload
- `npm run build` — compile TypeScript
- `npm start` — run compiled server
- `npm run prisma:migrate` — create/apply migrations
- `npm run prisma:seed` — seed admin + default taxonomies
