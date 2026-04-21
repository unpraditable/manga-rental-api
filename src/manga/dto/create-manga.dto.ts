import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateMangaDto {
  @IsString() title: string;
  @IsString() author: string;
  @IsString() genre: string;
  @IsInt() @Min(1) totalVolumes: number;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() description?: string;
}
