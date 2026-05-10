// prisma/seed.ts
import { PrismaClient, Role, VolumeStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const COVER_URLS: Record<string, string> = {
  'One Piece': 'https://cdn.myanimelist.net/images/manga/2/253146l.jpg',
  Naruto: 'https://cdn.myanimelist.net/images/manga/3/117681l.jpg',
  'Attack on Titan': 'https://cdn.myanimelist.net/images/manga/2/37846l.jpg',
  Bleach: 'https://myanimelist.net/images/manga/3/180031l.jpg', // ← paste URL dari MAL
  'Haikyuu!!': 'https://myanimelist.net/images/manga/2/258225l.jpg',
  'Jujutsu Kaisen': 'https://myanimelist.net/images/manga/3/210341l.jpg',
  'Dragon Ball': 'https://myanimelist.net/images/manga/1/267793l.jpg',
  'Demon Slayer': 'https://myanimelist.net/images/manga/3/179023l.jpg',
  Monster: 'https://myanimelist.net/images/manga/3/258224.jpg',
  '20th Century Boys': 'https://myanimelist.net/images/manga/5/260006.jpg',
  Pluto: 'https://myanimelist.net/images/manga/1/264496.jpg',
  "Frieren: Beyond Journey's End":
    'https://myanimelist.net/images/manga/3/232121l.jpg',
  'Oshi no Ko': 'https://myanimelist.net/images/manga/3/233991l.jpg',
  'Kurosagi (The Black Swindler)':
    'https://myanimelist.net/images/manga/2/161298.jpg',
  'Giant Killing': 'https://myanimelist.net/images/manga/3/147425l.jpg',
  'Ao Ashi': 'https://myanimelist.net/images/manga/1/185325.jpg',
  Medalist: 'https://myanimelist.net/images/manga/3/235204l.jpg',
};

// ── Data manga ────────────────────────────────────────────────────────────────
const mangaData = [
  // ── Lama ──
  {
    title: 'One Piece',
    author: 'Eiichiro Oda',
    genre: 'Adventure',
    totalVolumes: 107,
    description:
      'Petualangan Monkey D. Luffy mencari harta karun One Piece untuk menjadi Raja Bajak Laut.',
  },
  {
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    genre: 'Action',
    totalVolumes: 72,
    description:
      'Kisah ninja muda Naruto Uzumaki yang ingin menjadi Hokage di desa Konoha.',
  },
  {
    title: 'Attack on Titan',
    author: 'Hajime Isayama',
    genre: 'Dark',
    totalVolumes: 34,
    description:
      'Manusia berjuang melawan titan raksasa di dunia post-apokaliptik yang dikelilingi tembok raksasa.',
  },
  {
    title: 'Bleach',
    author: 'Tite Kubo',
    genre: 'Action',
    totalVolumes: 74,
    description:
      'Ichigo Kurosaki memperoleh kekuatan Soul Reaper dan melindungi dunia dari roh jahat.',
  },
  {
    title: 'Haikyuu!!',
    author: 'Haruichi Furudate',
    genre: 'Sports',
    totalVolumes: 45,
    description:
      'Perjalanan tim voli SMA Karasuno menuju puncak kompetisi nasional.',
  },
  {
    title: 'Jujutsu Kaisen',
    author: 'Gege Akutami',
    genre: 'Action',
    totalVolumes: 26,
    description:
      'Yuji Itadori terjun ke dunia kutukan dan penyihir setelah menelan jari Sukuna.',
  },
  {
    title: 'Dragon Ball',
    author: 'Akira Toriyama',
    genre: 'Action',
    totalVolumes: 42,
    description:
      'Petualangan Son Goku dari masa kecil mencari Dragon Ball hingga menjadi petarung terkuat.',
  },
  {
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    genre: 'Action',
    totalVolumes: 23,
    description:
      'Tanjiro Kamado menjadi pembasmi iblis untuk menyelamatkan adiknya yang berubah menjadi iblis.',
  },
  // ── Baru ──
  {
    title: 'Kurosagi (The Black Swindler)',
    author: 'Takeshi Natsuhara & Kuromaru',
    genre: 'Psychological',
    totalVolumes: 20,
    description:
      'Kurosaki menjadi penipu yang hanya menipu penipu lain demi membalas dendam atas hancurnya keluarganya.',
  },
  {
    title: 'Monster',
    author: 'Naoki Urasawa',
    genre: 'Psychological',
    totalVolumes: 18,
    description:
      'Dokter Tenma menyelamatkan nyawa seorang anak, namun anak itu tumbuh menjadi pembunuh kejam yang harus ia hentikan.',
  },
  {
    title: '20th Century Boys',
    author: 'Naoki Urasawa',
    genre: 'Mystery',
    totalVolumes: 22,
    description:
      'Kenji menyadari buku ramalan masa kecilnya kini dijadikan panduan sekte misterius yang hendak menguasai dunia.',
  },
  {
    title: 'Giant Killing',
    author: 'Masaya Tsunamoto & Tsujitomo',
    genre: 'Sports',
    totalVolumes: 69,
    description:
      'Pelatih eksentrik Tatsumi kembali melatih klub sepak bola East Tokyo United yang hampir degradasi.',
  },
  {
    title: 'Ao Ashi',
    author: 'Yūgo Kobayashi',
    genre: 'Sports',
    totalVolumes: 40,
    description:
      'Ashito Aoi, pemuda berbakat dari daerah terpencil, berjuang masuk akademi sepak bola elite Tokyo Esperion.',
  },
  {
    title: 'Pluto',
    author: 'Naoki Urasawa',
    genre: 'Sci-Fi',
    totalVolumes: 8,
    description:
      'Reimajinasi gelap Astro Boy — robot terkuat di dunia dibunuh satu per satu, dan Gesicht harus mengungkap pelakunya.',
  },
  {
    title: 'Medalist',
    author: 'Tsurumaikada',
    genre: 'Sports',
    totalVolumes: 14,
    description:
      'Inori dan Tsukasa bersatu mengejar podium tertinggi dunia figure skating.',
  },
  {
    title: "Frieren: Beyond Journey's End",
    author: 'Kanehito Yamada & Tsukasa Abe',
    genre: 'Fantasy',
    totalVolumes: 15,
    description:
      'Setelah mengalahkan Raja Iblis, penyihir elf Frieren memulai perjalanan untuk memahami arti kehidupan manusia.',
  },
  {
    title: 'Oshi no Ko',
    author: 'Aka Akasaka & Mengo Yokoyari',
    genre: 'Drama',
    totalVolumes: 16,
    description:
      'Seorang dokter bereinkarnasi sebagai anak dari idola favoritnya dan mengungkap sisi gelap industri hiburan Jepang.',
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding database...\n');

  // Price lists
  await Promise.all([
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
  console.log('✓ Price lists\n');

  // Users
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
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
  await prisma.user.upsert({
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
  console.log('✓ Users\n');

  // Manga + covers
  console.log('📚 Fetching covers dari MyAnimeList (Jikan API)...\n');

  for (const data of mangaData) {
    const mangaId = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    // Fetch cover
    const coverUrl = COVER_URLS[data.title] || null;

    const seededVolumes = Math.min(data.totalVolumes, 10);

    await prisma.manga.upsert({
      where: { id: mangaId },
      update: { coverUrl },
      create: {
        id: mangaId,
        title: data.title,
        author: data.author,
        genre: data.genre,
        totalVolumes: data.totalVolumes,
        coverUrl,
        description: data.description,
        volumes: {
          create: Array.from({ length: seededVolumes }, (_, i) => ({
            volumeNumber: i + 1,
            // Setiap vol ke-5 → RENTED, sisanya AVAILABLE (simulasi stok realistis)
            status:
              (i + 1) % 5 === 0 ? VolumeStatus.RENTED : VolumeStatus.AVAILABLE,
          })),
        },
      },
    });
  }

  console.log('\n' + '─'.repeat(48));
  console.log(`✅  Seed selesai!`);
  console.log(`    Manga   : ${mangaData.length} judul`);
  console.log(
    `    Volumes : ${mangaData.reduce((s, m) => s + Math.min(m.totalVolumes, 10), 0)} total`,
  );
  console.log('\n📋  Test credentials:');
  console.log(`    Customer : budi@email.com / password123`);
  console.log(`    Admin    : admin@mangarental.com / password123`);
}

main()
  .catch((e) => {
    console.error('\n❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
