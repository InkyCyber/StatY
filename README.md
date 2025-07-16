# StatY Hockey Stats Example

This is a simple Next.js application styled with **Tailwind CSS**. It uses
**Prisma** for the database layer and **Apollo GraphQL** for the API layer to
manage hockey teams, players and their stats.

## Getting Started

1. Install dependencies (requires access to npm):

   ```bash
   npm install
   ```

2. Generate Prisma client and migrate the SQLite database:

   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app. The
   GraphQL API is available at `/api/graphql`.

## Project Structure

- `pages/index.tsx` – Simple UI to manage teams and players.
- `pages/api/graphql.ts` – Apollo GraphQL server.
- `prisma/schema.prisma` – Prisma schema using SQLite.
- `.env` – Configuration file with the `DATABASE_URL` for Prisma.

## Example GraphQL Mutations

```graphql
mutation {
  addTeam(name: "Sharks") { id name }
}

mutation {
  addPlayer(name: "Jane Doe", teamId: 1) { id name }
}

mutation {
  updatePlayer(id: 1, name: "Janet") { id name }
}

mutation {
  updateStats(playerId: 1, goals: 3, assists: 2, games: 1) {
    goals
    assists
    games
  }
}

mutation {
  removeTeam(id: 1) { id name }
}
```

This repository does not include installed `node_modules` due to environment
limitations. Ensure you have Node.js installed locally to install dependencies
and run the application.
