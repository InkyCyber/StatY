const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const team = await prisma.team.upsert({
    where: { name: 'Sharks' },
    update: {},
    create: { name: 'Sharks' },
  });

  const player = await prisma.player.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Jane Doe',
      team: { connect: { id: team.id } },
      stats: {
        create: { goals: 1, assists: 2, games: 1 },
      },
    },
  });

  console.log({ team, player });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
