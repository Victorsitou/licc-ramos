# AGENTS.md

Web app (Spanish UI) for browsing LICC course slides. Next.js 16 App Router, React 19, MUI v7 + Emotion, Tailwind v4.

## Commands

- `npm run dev` / `npm run build` — both first run `copy-assets`, which copies `pdf.worker.min.mjs` into `public/`. The PDFViewer needs that worker; run these scripts, not bare `next dev`/`next build`.
- `npm run lint` — eslint only.
- No test or typecheck scripts. For typechecking: `npx tsc --noEmit`.
- After editing `prisma/schema.prisma`: `npx prisma migrate dev`, then `npx prisma generate`. The generated client at `src/generated/prisma` is **committed to git** — commit regenerated output too (the `.gitignore` entry `/app/generated/prisma` is a stale path that doesn't match it).

## Architecture

- Path aliases: `@/*` → repo root, `@lib/*` → `app/lib/*`. Generated Prisma imports are `@/src/generated/prisma`.
- Prisma 7 uses the driver adapter (no URL in `schema.prisma`): `src/lib/prisma.ts` builds `PrismaPg` from `DATABASE_URL` with `ssl: { rejectUnauthorized: false }`. `prisma.config.ts` supplies the datasource for CLI/migrate commands.
- Auth: JWT via `jose` in httpOnly cookies: `token` (access, 15-min expiry) + `refreshToken` (opaque, 30 days, stored SHA-256-hashed in the `RefreshToken` Prisma table). Refresh is **client-driven**: `authedFetch` (app/services/api.ts) single-flights a `POST /api/auth/refresh` on 401 and retries once; the wrappers (`withAdmin` / `withVerified`, app/api/wrappers/) and `/api/auth/me` only verify the access token. Rotation is atomic (transaction); the refresh cookie is scoped to `path=/api/auth`; reuse of an already-rotated token revokes the user's whole token family (30s grace for tab races). Logout revokes via the refresh cookie so it works even after the access token expires. Passwords: bcryptjs, 12 rounds.
- Users are stored by **email username only**: `createUser` saves `email.split("@")[0]`, and login matches the same way. Only `@uc.cl` / `@estudiante.uc.cl` addresses pass registration (zod regex in `app/api/dtos/user.dto.ts`).
- PDFs live in Cloudflare R2 (S3-compatible, `src/lib/r2.ts`), keyed like `<slug>/Ayudantias/<file>`. `GET /api/[file-url]?key=...` returns a 15-min presigned URL and requires a verified user. Admins upload via base64 to `/api/resources/cf` (dashboard).
- Course content is JSON under `app/cursos/**` (read recursively by `/api/cursos`); `app/ramos.json` + `RamoInterface` in `app/utils.ts` are the legacy data source. Per-course pages: `app/[slug]/` with `clases` / `ayudantias` sub-routes.

## Gotchas

- `zod` is imported across `app/api/dtos/*` and `src/lib/errors.ts` but is **not declared** in `package.json` — it only resolves transitively via `eslint-config-next`. Declare it as a direct dependency if you rely on it more.
- Required env vars (see `.env`): `DATABASE_URL`, `JWT_SECRET`, `R2_ENDPOINT`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `EMAIL_USER`/`EMAIL_PASS` (Gmail app password for nodemailer), `VALIDATE_URL`, `NEXT_PUBLIC_SERVICE_URL`, `NEXT_PUBLIC_VERIFY_URL`.
- Default branch is `master`. `.github/workflows/migrate.yml` runs `prisma migrate deploy` on push to master when `prisma/**` changes.
- No test suite; verification is lint + typecheck + manual dev run.
