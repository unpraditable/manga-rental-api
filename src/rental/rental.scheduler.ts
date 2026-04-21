import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RentalScheduler {
  private readonly logger = new Logger(RentalScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notif: NotificationsService,
  ) {}

  // ── Setiap hari jam 08:00 ─────────────────────────────────────────────────
  @Cron('0 8 * * *')
  async handleDailyCheck() {
    this.logger.log('Menjalankan pengecekan denda harian...');
    await Promise.all([this.markOverdue(), this.sendDueSoonNotifications()]);
  }

  // Tandai ACTIVE → OVERDUE jika sudah lewat jatuh tempo
  private async markOverdue() {
    const result = await this.prisma.rental.updateMany({
      where: {
        status: 'ACTIVE',
        dueDate: { lt: new Date() },
      },
      data: { status: 'OVERDUE' },
    });
    if (result.count > 0)
      this.logger.log(`${result.count} rental ditandai OVERDUE`);
  }

  // Kirim notifikasi H-1 dan H-3 sebelum jatuh tempo
  private async sendDueSoonNotifications() {
    const now = new Date();

    for (const daysBefore of [1, 3]) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysBefore);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const rentals = await this.prisma.rental.findMany({
        where: {
          status: 'ACTIVE',
          dueDate: { gte: targetDate, lt: nextDay },
        },
        include: {
          volume: { include: { manga: true } },
        },
      });

      for (const r of rentals) {
        await this.notif.create({
          userId: r.userId,
          type: 'due_soon',
          title: `Jatuh tempo ${daysBefore === 1 ? 'besok!' : 'dalam 3 hari'}`,
          body: `${r.volume.manga.title} Vol. ${r.volume.volumeNumber} harus dikembalikan ${daysBefore === 1 ? 'besok' : 'dalam 3 hari'}.`,
        });
      }
    }
  }
}
