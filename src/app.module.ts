import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MangaModule } from './manga/manga.module';
import { PriceListModule } from './price-list/price-list.module';
import { RentalModule } from './rental/rental.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    MangaModule,
    RentalModule,
    UsersModule,
    PriceListModule,
    NotificationsModule,
  ],
})
export class AppModule {}
