# My Fav Note App

A full-stack note app built with **Next.js (App Router)** + **PostgreSQL** + **Prisma**, featuring:
- Email/password **sign up** + **sign in** (JWT)
- Create, list, edit, delete notes (per-user)
- Notes filtering (tags + search)

## Getting started

### 1) Install

```bash
npm install
```

### 2) Environment variables

Create `.env` at the project root (see `.env.example`):

- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: secret used to sign auth tokens

### 3) Prisma generate + migrate

Generate client (also runs automatically on install via `postinstall`):

```bash
npx prisma generate
```

Run migrations (development):

```bash
npx prisma migrate dev
```

### 4) Run the dev server

Default:

```bash
npm run dev
```

If you hit Turbopack CSS crashes, use Webpack:

```bash
npm run dev:webpack
```

Then open `http://localhost:3000`.

## App structure

High-level folder layout:

```text
My-fav-note-app/
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ generated/
│  └─ prisma/                 # generated Prisma Client output
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  │  ├─ login/route.js
│  │  │  │  └─ register/route.js
│  │  │  └─ notes/
│  │  │     ├─ route.js        # GET/POST /api/notes
│  │  │     └─ [id]/route.js   # PUT/DELETE /api/notes/:id
│  │  ├─ (app)/
│  │  │  ├─ layout.js
│  │  │  └─ notes/page.js
│  │  └─ layout.js
│  ├─ components/
│  │  ├─ AuthForm.jsx
│  │  ├─ Notes.jsx
│  │  ├─ NoteModal.jsx
│  │  └─ DeleteConfirmModal.jsx
│  ├─ lib/
│  │  ├─ api.js                # fetch wrapper used by the client
│  │  ├─ prisma.js             # PrismaClient singleton (pg adapter)
│  │  ├─ verifyToken.js         # JWT parsing for API routes
│  │  └─ sendError.js           # API error helper
│  ├─ providers/
│  │  └─ StoreProvider.jsx
│  └─ store/
│     └─ slices/
│        ├─ notesSlice.js
│        └─ uiSlice.js
├─ package.json
└─ README.md
```

## API endpoints

All routes are under `/api/*` (Next.js route handlers).

### Auth
- `POST /api/auth/register`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "token": string }`
- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "token": string }`

### Notes (JWT required)
JWT is sent as `Authorization: Bearer <token>`.

- `GET /api/notes` → list current user’s notes
- `POST /api/notes` → create a note
  - Body: `{ "title": string, "content": string, "tag"?: string }`
- `PUT /api/notes/:id` → update a note (must belong to user)
- `DELETE /api/notes/:id` → delete a note (must belong to user)

## Database (Prisma)

### Prisma schema
- `User` maps to table `users`
- `Note` maps to table `notes`
- `Note.userId` maps to the **snake_case** column `user_id` via `@map("user_id")`

### Generated client output
The Prisma Client is generated into `generated/prisma` (configured in `prisma/schema.prisma`).

## What was modified (detailed)

### Prisma integration
- Added `prisma/schema.prisma` with `User` and `Note` models and table mappings (`@@map`).
- Configured Prisma Client output to `generated/prisma`.
- Added `prisma.config.ts` so Prisma CLI can load `DATABASE_URL` from `.env` for migrations.
- Added `src/lib/prisma.js` Prisma singleton using `@prisma/adapter-pg` to avoid too many connections in dev reloads.
- Added `postinstall: prisma generate` in `package.json`.

### Fixed DB column mismatch (`userId` vs `user_id`)
- Updated schema mapping: `Note.userId @map("user_id")` so Prisma queries match your existing `notes.user_id` column.

### Updated API routes to Prisma
- Migrated auth routes to Prisma:
  - `src/app/api/auth/login/route.js`
  - `src/app/api/auth/register/route.js`
- Migrated notes routes to Prisma:
  - `src/app/api/notes/route.js`
  - `src/app/api/notes/[id]/route.js`

### Fixed Sign up / Sign in UI
- Updated `src/components/AuthForm.jsx` to use `src/lib/api.js` (fetch wrapper) instead of a missing `axios` import.
- Normalized error handling to use `error.responseData` from `api.js`.

### Fixed note edit (PUT) in Next.js 16
- Updated `src/app/api/notes/[id]/route.js` to `await params` (Next.js 16 treats route `params` as async).

### Redux provider wiring
- Replaced the removed `NotesProvider/useNotesApp` usage with Redux-based wiring:
  - `src/app/(app)/layout.js` uses `StoreProvider`
  - `src/app/(app)/notes/page.js` uses Redux selectors/actions

### Turbopack workaround
- Added `dev:webpack` and `build:webpack` scripts in `package.json` to bypass occasional Turbopack/PostCSS crashes when processing `src/app/globals.css`.

## Scripts

- `npm run dev`: Next dev (default bundler)
- `npm run dev:webpack`: Next dev using Webpack (stable fallback)
- `npm run build`: production build
- `npm run build:webpack`: production build using Webpack
- `npm run start`: run production server
