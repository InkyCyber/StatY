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
    goals: Int!
    assists: Int!
    penaltyMinutes: Int!
    team: Team!
  }

  type Query {
    hello: String!
    counter: Int!
    teams: [Team!]!
    team(id: Int!): Team
    players: [Player!]!
    player(id: Int!): Player
  }

  type Mutation {
    incrementCounter(amount: Int = 1): Int!
    createTeam(name: String!): Team!
    deleteTeam(id: Int!): Team!
    addPlayer(teamId: Int!, name: String!): Player!
    removePlayer(id: Int!): Player!
    addGoal(playerId: Int!, amount: Int = 1): Player!
    removeGoal(playerId: Int!, amount: Int = 1): Player!
    addAssist(playerId: Int!, amount: Int = 1): Player!
    removeAssist(playerId: Int!, amount: Int = 1): Player!
    addPenaltyMinutes(playerId: Int!, amount: Int = 1): Player!
    removePenaltyMinutes(playerId: Int!, amount: Int = 1): Player!
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo!',
    counter: async () => {
      const existing = await prisma.counter.findUnique({ where: { id: 1 } })
      if (!existing) {
        const created = await prisma.counter.create({ data: { id: 1, value: 0 } })
        return created.value
      }
      return existing.value
    },
    teams: () => prisma.team.findMany({ include: { players: true } }),
    team: (_: any, args: { id: number }) =>
      prisma.team.findUnique({ where: { id: args.id }, include: { players: true } }),
    players: () => prisma.player.findMany({ include: { team: true } }),
    player: (_: any, args: { id: number }) =>
      prisma.player.findUnique({ where: { id: args.id }, include: { team: true } })
  },
  Mutation: {
    incrementCounter: async (_: any, args: { amount?: number }) => {
      const amount = args.amount ?? 1
      const updated = await prisma.counter.upsert({
        where: { id: 1 },
        update: { value: { increment: amount } },
        create: { id: 1, value: amount }
      })
      return updated.value
    },
    createTeam: (_: any, args: { name: string }) =>
      prisma.team.create({ data: { name: args.name } }),
    deleteTeam: (_: any, args: { id: number }) =>
      prisma.team.delete({ where: { id: args.id } }),
    addPlayer: (_: any, args: { teamId: number; name: string }) =>
      prisma.player.create({ data: { name: args.name, teamId: args.teamId } }),
    removePlayer: (_: any, args: { id: number }) =>
      prisma.player.delete({ where: { id: args.id } }),
    addGoal: (_: any, args: { playerId: number; amount?: number }) =>
      prisma.player.update({
        where: { id: args.playerId },
        data: { goals: { increment: args.amount ?? 1 } }
      }),
    removeGoal: async (_: any, args: { playerId: number; amount?: number }) => {
      const player = await prisma.player.findUnique({ where: { id: args.playerId } })
      const dec = args.amount ?? 1
      const newGoals = Math.max(0, (player?.goals || 0) - dec)
      return prisma.player.update({ where: { id: args.playerId }, data: { goals: newGoals } })
    },
    addAssist: (_: any, args: { playerId: number; amount?: number }) =>
      prisma.player.update({ where: { id: args.playerId }, data: { assists: { increment: args.amount ?? 1 } } }),
    removeAssist: async (_: any, args: { playerId: number; amount?: number }) => {
      const player = await prisma.player.findUnique({ where: { id: args.playerId } })
      const dec = args.amount ?? 1
      const newVal = Math.max(0, (player?.assists || 0) - dec)
      return prisma.player.update({ where: { id: args.playerId }, data: { assists: newVal } })
    },
    addPenaltyMinutes: (_: any, args: { playerId: number; amount?: number }) =>
      prisma.player.update({ where: { id: args.playerId }, data: { penaltyMinutes: { increment: args.amount ?? 1 } } }),
    removePenaltyMinutes: async (_: any, args: { playerId: number; amount?: number }) => {
      const player = await prisma.player.findUnique({ where: { id: args.playerId } })
      const dec = args.amount ?? 1
      const newVal = Math.max(0, (player?.penaltyMinutes || 0) - dec)
      return prisma.player.update({ where: { id: args.playerId }, data: { penaltyMinutes: newVal } })
    }
  }
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}

export const config = {
  api: {
    bodyParser: false
  }
}
