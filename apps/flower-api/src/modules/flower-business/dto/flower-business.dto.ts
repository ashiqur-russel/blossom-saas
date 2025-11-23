import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  FlowerWeekDTO,
  CreateFlowerWeekDTO,
  UpdateFlowerWeekDTO,
  FlowerWeekSummaryDTO,
  SaleByDay,
} from '../../../../../../packages/shared-types/src/dtos/flower-week.dto';

export class SaleByDayDTO implements SaleByDay {
  @ApiProperty({ example: 0, description: 'Sales on Thursday' })
  @IsNumber()
  @Min(0)
  thursday: number;

  @ApiProperty({ example: 0, description: 'Sales on Friday' })
  @IsNumber()
  @Min(0)
  friday: number;

  @ApiProperty({ example: 0, description: 'Sales on Saturday' })
  @IsNumber()
  @Min(0)
  saturday: number;
}

export class CreateFlowerWeekRequestDTO implements CreateFlowerWeekDTO {
  @ApiProperty({ example: 1, description: 'Week number (1-53)' })
  @IsInt()
  @Min(1)
  weekNumber: number;

  @ApiProperty({ example: 2025, description: 'Year' })
  @IsInt()
  @Min(2000)
  year: number;

  @ApiProperty({ example: '2025-01-06T00:00:00.000Z', description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-01-12T23:59:59.999Z', description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: 280, description: 'Total flowers bought' })
  @IsNumber()
  @Min(0)
  totalFlower: number;

  @ApiProperty({ example: 5000, description: 'Total buying price' })
  @IsNumber()
  @Min(0)
  totalBuyingPrice: number;

  @ApiProperty({ type: SaleByDayDTO, description: 'Sales by day' })
  @ValidateNested()
  @Type(() => SaleByDayDTO)
  sale: SaleByDay;

  @ApiProperty({ example: 8000, description: 'Total sales amount' })
  @IsNumber()
  @Min(0)
  totalSale: number;

  @ApiProperty({ example: 3000, description: 'Profit' })
  @IsNumber()
  profit: number;

  @ApiProperty({ example: 8000, description: 'Revenue' })
  @IsNumber()
  @Min(0)
  revenue: number;

  @ApiProperty({ example: 500, description: 'Savings' })
  @IsNumber()
  @Min(0)
  savings: number;
}

export class UpdateFlowerWeekRequestDTO extends PartialType(CreateFlowerWeekRequestDTO) implements UpdateFlowerWeekDTO {
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

  @ApiProperty({ type: SaleByDayDTO, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SaleByDayDTO)
  sale?: SaleByDay;

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

export class FlowerWeekResponseDTO implements FlowerWeekDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  weekNumber: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  totalFlower: number;

  @ApiProperty()
  totalBuyingPrice: number;

  @ApiProperty({ type: SaleByDayDTO })
  sale: SaleByDay;

  @ApiProperty()
  totalSale: number;

  @ApiProperty()
  profit: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  savings: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FlowerWeekSummaryResponseDTO implements FlowerWeekSummaryDTO {
  @ApiProperty()
  totalWeeks: number;

  @ApiProperty()
  totalFlowers: number;

  @ApiProperty()
  totalBuyingPrice: number;

  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  totalProfit: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalSavings: number;

  @ApiProperty()
  averageProfit: number;

  @ApiProperty()
  averageFlowers: number;

  @ApiProperty({ nullable: true })
  bestWeek: {
    weekNumber: number;
    year: number;
    profit: number;
  } | null;
}
