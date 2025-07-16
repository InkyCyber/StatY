# StatY Next.js Example

This is a minimal Next.js application configured with **Prisma** for the
database layer and **Apollo GraphQL** for the API layer.

## Getting Started

1. Install dependencies (requires access to npm):

   ```bash
   npm install
   ```

2. Generate Prisma client and migrate the SQLite database:

   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.ts
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app. The
   GraphQL API is available at `/api/graphql`.

## Project Structure

- `pages/index.tsx` – Home page with a simple counter.
- `pages/api/graphql.ts` – Apollo GraphQL server running as a Next.js API
  route.
- `prisma/schema.prisma` – Prisma schema using SQLite.
- `.env` – Configuration file with the `DATABASE_URL` for Prisma.

This repository does not include installed `node_modules` due to environment
limitations. Ensure you have Node.js installed locally to install dependencies
and run the application.
