import { MediaType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addStatusForAllUsers() {
  const users = await prisma.user.findMany({ select: { id: true } });

  const medias = [
    {
      key: 'images/e493ae9d-1192-4a5c-aa31-60228908f1d8-f521127cfe76995a71fa597160da220d.jpg',
      url: 'https://vibe-s3.s3.ap-south-1.amazonaws.com/images/e493ae9d-1192-4a5c-aa31-60228908f1d8-f521127cfe76995a71fa597160da220d.jpg',
      mediaType: MediaType.IMAGE,
    },
  ];

  for (const user of users) {
    await prisma.status.create({
      data: {
        userId: user.id,
        statusType: 'MEDIA',
        medias: {
          create: medias,
        },
      },
      include: { medias: true },
    });

    console.log(`Status added for user ${user.id}`);
  }

  console.log(`Successfully added status for ${users.length} users.`);
}

addStatusForAllUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
