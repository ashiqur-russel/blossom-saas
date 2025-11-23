/**
 * Create Week DTO - Request DTO
 * Follows NestJS best practices: DTOs in dtos folder with validation
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaleByDayDto {
  @ApiProperty({ example: 100, description: 'Sales on Thursday' })
  @IsNumber()
  @Min(0)
  thursday: number;

  @ApiProperty({ example: 150, description: 'Sales on Friday' })
  @IsNumber()
  @Min(0)
  friday: number;

  @ApiProperty({ example: 200, description: 'Sales on Saturday' })
  @IsNumber()
  @Min(0)
  saturday: number;
}

export class CreateWeekDto {
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

  @ApiProperty({ type: SaleByDayDto, description: 'Sales by day' })
  @ValidateNested()
  @Type(() => SaleByDayDto)
  sale: SaleByDayDto;

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


