import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { CreateRentalDto } from './dto/create-rental.dto';
import { addDays } from 'date-fns';

@Injectable()
export class RentalService {
  constructor(
    private prisma: PrismaService,
    private notif: NotificationsService,
  ) {}

  // ── Buat rental baru ───────────────────────────────────────────────────────
  async create(userId: string, dto: CreateRentalDto) {
    // 1. Cek volume tersedia
    const volume = await this.prisma.mangaVolume.findUnique({
      where: { id: dto.volumeId },
      include: { manga: true },
    });
    if (!volume) throw new NotFoundException('Volume tidak ditemukan');
    if (volume.status !== 'AVAILABLE')
      throw new BadRequestException('Volume sedang tidak tersedia');

    // 2. Cek price list valid
    const priceList = await this.prisma.priceList.findUnique({
      where: { id: dto.priceListId },
    });
    if (!priceList || !priceList.isActive)
      throw new BadRequestException('Paket harga tidak valid');

    // 3. Buat rental + update status volume (satu transaksi)
    const dueDate = addDays(new Date(), priceList.durationDays);

    const rental = await this.prisma.$transaction(async (tx) => {
      const r = await tx.rental.create({
        data: {
          userId,
          volumeId: dto.volumeId,
          priceListId: dto.priceListId,
          dueDate,
        },
        include: {
          volume: { include: { manga: true } },
          priceList: true,
        },
      });

      await tx.mangaVolume.update({
        where: { id: dto.volumeId },
        data: { status: 'RENTED' },
      });

      return r;
    });

    // 4. Kirim notifikasi konfirmasi
    await this.notif.create({
      userId,
      type: 'rental_confirmed',
      title: 'Sewa berhasil!',
      body: `${rental.volume.manga.title} Vol. ${rental.volume.volumeNumber} — jatuh tempo ${dueDate.toLocaleDateString('id-ID')}`,
    });

    return rental;
  }

  // ── Ambil pinjaman milik user ──────────────────────────────────────────────
  findMyRentals(userId: string, status?: string) {
    return this.prisma.rental.findMany({
      where: {
        userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...(status && { status: status.toUpperCase() as any }),
      },
      include: {
        volume: { include: { manga: true } },
        priceList: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Kembalikan buku (dipanggil admin via endpoint) ─────────────────────────
  async returnRental(rentalId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id: rentalId },
      include: { priceList: true },
    });
    if (!rental) throw new NotFoundException();
    if (rental.status === 'RETURNED')
      throw new BadRequestException('Sudah dikembalikan');

    const returnDate = new Date();
    const dueDate = rental.dueDate;
    const daysLate = Math.max(
      0,
      Math.ceil((returnDate.getTime() - dueDate.getTime()) / 86_400_000),
    );
    const fineAmount = daysLate * Number(rental.priceList.finePerDay);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.rental.update({
        where: { id: rentalId },
        data: { returnDate, status: 'RETURNED', fineAmount },
      });

      await tx.mangaVolume.update({
        where: { id: rental.volumeId },
        data: { status: 'AVAILABLE' },
      });

      return updated;
    });
  }
}
