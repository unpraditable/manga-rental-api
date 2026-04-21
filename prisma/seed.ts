import { PrismaClient, Role, VolumeStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Price lists ────────────────────────────────────────────────────────────
  const priceLists = await Promise.all([
    prisma.priceList.upsert({
      where: { id: 'pl-3d' },
      update: {},
      create: { id: 'pl-3d', durationDays: 3, price: 8000, finePerDay: 2000 },
    }),
    prisma.priceList.upsert({
      where: { id: 'pl-7d' },
      update: {},
      create: { id: 'pl-7d', durationDays: 7, price: 15000, finePerDay: 2000 },
    }),
    prisma.priceList.upsert({
      where: { id: 'pl-14d' },
      update: {},
      create: {
        id: 'pl-14d',
        durationDays: 14,
        price: 25000,
        finePerDay: 2000,
      },
    }),
  ]);
  console.log(`✓ ${priceLists.length} price lists`);

  // ── Users ──────────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mangarental.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@mangarental.com',
      passwordHash: hash,
      role: Role.ADMIN,
      phone: '081200000000',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'budi@email.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'budi@email.com',
      passwordHash: hash,
      role: Role.CUSTOMER,
      phone: '081234567890',
    },
  });
  console.log(`✓ Users: ${admin.email}, ${customer.email}`);

  // ── Manga ──────────────────────────────────────────────────────────────────
  const mangaData = [
    {
      title: 'One Piece',
      author: 'Eiichiro Oda',
      genre: 'Adventure',
      totalVolumes: 107,
      description: 'Petualangan Monkey D. Luffy mencari harta karun One Piece.',
    },
    {
      title: 'Naruto',
      author: 'Masashi Kishimoto',
      genre: 'Action',
      totalVolumes: 72,
      description: 'Kisah ninja muda Naruto Uzumaki yang ingin menjadi Hokage.',
    },
    {
      title: 'Attack on Titan',
      author: 'Hajime Isayama',
      genre: 'Dark',
      totalVolumes: 34,
      description: 'Manusia vs titan raksasa di dunia post-apokaliptik.',
    },
    {
      title: 'Bleach',
      author: 'Tite Kubo',
      genre: 'Action',
      totalVolumes: 74,
      description: 'Ichigo Kurosaki memperoleh kekuatan Soul Reaper.',
    },
    {
      title: 'Haikyuu!!',
      author: 'Haruichi Furudate',
      genre: 'Sports',
      totalVolumes: 45,
      description: 'Perjalanan tim voli SMA Karasuno menuju puncak.',
    },
    {
      title: 'Jujutsu Kaisen',
      author: 'Gege Akutami',
      genre: 'Action',
      totalVolumes: 26,
      description: 'Yuji Itadori terjun ke dunia kutukan dan penyihir.',
    },
    {
      title: 'Dragon Ball',
      author: 'Akira Toriyama',
      genre: 'Action',
      totalVolumes: 42,
      description: 'Son Goku dan petualangannya mencari Dragon Ball.',
    },
    {
      title: 'Demon Slayer',
      author: 'Koyoharu Gotouge',
      genre: 'Action',
      totalVolumes: 23,
      description: 'Tanjiro Kamado berjuang sebagai pembasmi iblis.',
    },
  ];

  for (const data of mangaData) {
    const manga = await prisma.manga.upsert({
      where: { id: data.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: data.title.toLowerCase().replace(/\s+/g, '-'),
        ...data,
        volumes: {
          create: Array.from(
            { length: Math.min(data.totalVolumes, 10) },
            (_, i) => ({
              volumeNumber: i + 1,
              status:
                i % 5 === 0 ? VolumeStatus.RENTED : VolumeStatus.AVAILABLE,
            }),
          ),
        },
      },
    });
    console.log(`  ✓ ${manga.title}`);
  }

  console.log('\nSeed selesai!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
