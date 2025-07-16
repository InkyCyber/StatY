import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com'
    }
  })
  console.log({ alice })

  const counter = await prisma.counter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, value: 0 }
  })
  console.log({ counter })

  const team = await prisma.team.create({
    data: {
      name: 'Team A',
      players: {
        create: [
          { name: 'Player 1' },
          { name: 'Player 2' }
        ]
      }
    }
  })
  console.log({ team })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
