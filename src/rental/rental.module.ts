import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { RentalScheduler } from './rental.scheduler';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [RentalService, RentalScheduler],
  controllers: [RentalController],
})
export class RentalModule {}
