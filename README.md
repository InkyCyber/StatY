# StatY Next.js Example

This is a minimal Next.js application configured with **Prisma** for the
database layer and **Apollo GraphQL** for the API layer. It provides a simple UI
for managing hockey teams and players using Tailwind CSS.

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
   Example operations:

   ```graphql
   query { teams { id name players { id name } } }
   mutation { createTeam(name:"My Team") { id name } }
   ```

## Project Structure

- `pages/index.tsx` – Home page that lists teams and players and allows CRUD
  operations via GraphQL.
- `pages/api/graphql.ts` – Apollo GraphQL server running as a Next.js API
  route.
- `prisma/schema.prisma` – Prisma schema using SQLite.
- `.env` – Configuration file with the `DATABASE_URL` for Prisma.

This repository does not include installed `node_modules` due to environment
limitations. Ensure you have Node.js installed locally to install dependencies
and run the application.

## GraphQL Mutations

```graphql
mutation { createTeam(name: "My Team") { id name } }
mutation { deleteTeam(id: 1) { id } }
mutation { addPlayer(teamId: 1, name: "New Player") { id name } }
mutation { removePlayer(id: 1) { id } }
mutation { addGoal(playerId: 1) { id goals } }
mutation { removeGoal(playerId: 1) { id goals } }
mutation { addAssist(playerId: 1) { id assists } }
mutation { removeAssist(playerId: 1) { id assists } }
mutation { addPenaltyMinutes(playerId: 1, amount: 2) { id penaltyMinutes } }
mutation { removePenaltyMinutes(playerId: 1, amount: 2) { id penaltyMinutes } }
```
