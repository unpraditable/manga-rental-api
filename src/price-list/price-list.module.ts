import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceListController } from './price-list.controller';

@Module({ providers: [PriceListService], controllers: [PriceListController] })
export class PriceListModule {}
