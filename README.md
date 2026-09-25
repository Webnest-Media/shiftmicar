# Shift My Car

Monorepo with a separate Next.js frontend and Node.js backend.

```
project-root/
├── frontend/     # Next.js website + CMS UI
├── backend/      # Express + Prisma + PostgreSQL API
├── .gitignore
└── README.md
```

## Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Required env:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run prisma:seed
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)

Required env:

```
DATABASE_URL=
PORT=4000
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:4000
```

Optional local Postgres via Docker:

```bash
docker compose -f backend/docker-compose.yml up -d
```

## Architecture

```
frontend  →  REST API  →  backend  →  Prisma  →  PostgreSQL
```

The frontend never connects to PostgreSQL directly.
Prisma and database credentials live only in `/backend`.
# shiftmicar
