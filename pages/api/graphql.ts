import { ApolloServer, gql } from 'apollo-server-micro'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = gql`
  type Team {
    id: Int!
    name: String!
    players: [Player!]!
  }

  type Player {
    id: Int!
    name: String!
    team: Team
    stats: Stats
  }

  type Stats {
    id: Int!
    goals: Int!
    assists: Int!
    games: Int!
  }

  type Query {
    teams: [Team!]!
  }

  type Mutation {
    addTeam(name: String!): Team!
    removeTeam(id: Int!): Team
    addPlayer(name: String!, teamId: Int!): Player!
    updatePlayer(id: Int!, name: String, teamId: Int): Player!
    updateStats(playerId: Int!, goals: Int, assists: Int, games: Int): Stats!
  }
`

const resolvers = {
  Query: {
    teams: () =>
      prisma.team.findMany({
        include: { players: { include: { stats: true } } },
      }),
  },
  Mutation: {
    addTeam: (_: unknown, { name }: { name: string }) =>
      prisma.team.create({ data: { name } }),
    removeTeam: (_: unknown, { id }: { id: number }) =>
      prisma.team.delete({ where: { id } }),
    addPlayer: (
      _: unknown,
      { name, teamId }: { name: string; teamId: number }
    ) =>
      prisma.player.create({
        data: {
          name,
          team: { connect: { id: teamId } },
          stats: { create: {} },
        },
      }),
    updatePlayer: (
      _: unknown,
      { id, name, teamId }: { id: number; name?: string; teamId?: number }
    ) =>
      prisma.player.update({
        where: { id },
        data: { ...(name && { name }), ...(teamId && { teamId }) },
      }),
    updateStats: (
      _: unknown,
      {
        playerId,
        goals,
        assists,
        games,
      }: { playerId: number; goals?: number; assists?: number; games?: number }
    ) =>
      prisma.stats.upsert({
        where: { playerId },
        update: { ...(goals !== undefined && { goals }), ...(assists !== undefined && { assists }), ...(games !== undefined && { games }) },
        create: {
          player: { connect: { id: playerId } },
          goals: goals ?? 0,
          assists: assists ?? 0,
          games: games ?? 0,
        },
      }),
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
