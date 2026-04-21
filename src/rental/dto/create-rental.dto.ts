import { IsUUID } from 'class-validator';

export class CreateRentalDto {
  @IsUUID()
  volumeId: string;

  @IsUUID()
  priceListId: string;
}
