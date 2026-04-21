import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PriceListService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.priceList.findMany({
      where: { isActive: true },
      orderBy: { durationDays: 'asc' },
    });
  }
}
