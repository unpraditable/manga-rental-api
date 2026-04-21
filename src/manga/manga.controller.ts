import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { QueryMangaDto } from './dto/query-manga.dto';
import { CreateMangaDto } from './dto/create-manga.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('manga')
export class MangaController {
  constructor(private manga: MangaService) {}

  // Publik — siapa pun bisa lihat katalog
  @Get()
  findAll(@Query() query: QueryMangaDto) {
    return this.manga.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manga.findOne(id);
  }

  // Hanya admin yang bisa tambah manga
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateMangaDto) {
    return this.manga.create(dto);
  }
}
