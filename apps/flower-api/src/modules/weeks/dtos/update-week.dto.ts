/**
 * Update Week DTO - Request DTO
 * Follows NestJS best practices: PartialType for updates
 */
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWeekDto, SaleByDayDto } from './create-week.dto';

export class UpdateWeekDto extends PartialType(CreateWeekDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  weekNumber?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFlower?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalBuyingPrice?: number;

  @ApiProperty({ type: SaleByDayDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SaleByDayDto)
  sale?: SaleByDayDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSale?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  profit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  savings?: number;
}

