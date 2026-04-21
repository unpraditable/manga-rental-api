import { Controller, Get } from '@nestjs/common';
import { PriceListService } from './price-list.service';

@Controller('price-lists')
export class PriceListController {
  constructor(private service: PriceListService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
