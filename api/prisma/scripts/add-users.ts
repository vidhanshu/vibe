import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const names = [
    'James',
    'Michael',
    'Bernadette',
    'Penny',
    'Sheldon',
    'Amy',
    'Leonard',
    'Raj',
    'Stuart',
    'Howard',
  ];
  const surname = [
    'Hofstadter',
    'Wolovitz',
    'Farrah',
    'Cooper',
    'Gaga',
    'Koothrappali',
    'Bialik',
    'Nayyar',
    'Helberg',
  ];

  const users = Array.from({ length: 20 }).map((_, idx) => ({
    username: `user-${idx + 1}`,
    name: `${names[Math.floor(Math.random() * names.length)]} ${surname[Math.floor(Math.random() * surname.length)]}`,
    password: 'Vidhanshu#123',
  }));

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    await prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        password: hashedPassword,
      },
    });
  }

  console.log('Users seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
