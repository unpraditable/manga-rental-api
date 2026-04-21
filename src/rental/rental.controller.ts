import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalController {
  constructor(private rental: RentalService) {}

  // Customer: buat sewa baru
  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateRentalDto) {
    return this.rental.create(user.id, dto);
  }

  // Customer: lihat pinjaman sendiri
  @Get('me')
  findMine(
    @CurrentUser() user: { id: string },
    @Query('status') status?: string,
  ) {
    return this.rental.findMyRentals(user.id, status);
  }

  // Admin: proses pengembalian
  @Patch(':id/return')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  returnRental(@Param('id') id: string) {
    return this.rental.returnRental(id);
  }
}
