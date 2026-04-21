import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { QueryMangaDto } from './dto/query-manga.dto';
import type { CreateMangaDto } from './dto/create-manga.dto';

@Injectable()
export class MangaService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryMangaDto) {
    const { search, genre, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { author: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(genre && { genre: { equals: genre, mode: 'insensitive' as const } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.manga.findMany({
        where,
        skip,
        take: limit,
        orderBy: { title: 'asc' },
        include: {
          _count: { select: { volumes: { where: { status: 'AVAILABLE' } } } },
        },
      }),
      this.prisma.manga.count({ where }),
    ]);

    return {
      data: data.map((m) => ({
        ...m,
        availableCount: m._count.volumes,
        _count: undefined,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const manga = await this.prisma.manga.findUnique({
      where: { id },
      include: {
        volumes: { orderBy: { volumeNumber: 'asc' } },
      },
    });
    if (!manga) throw new NotFoundException('Manga tidak ditemukan');
    return manga;
  }

  async create(dto: CreateMangaDto) {
    return this.prisma.manga.create({
      data: {
        ...dto,
        volumes: {
          create: Array.from({ length: dto.totalVolumes }, (_, i) => ({
            volumeNumber: i + 1,
          })),
        },
      },
      include: { volumes: true },
    });
  }
}
