/**
 * Week Summary DTO - Response DTO
 * Follows NestJS best practices: Separate DTOs for different responses
 */
import { ApiProperty } from '@nestjs/swagger';

export class BestWeekDto {
  @ApiProperty({ example: 1 })
  weekNumber: number;

  @ApiProperty({ example: 2025 })
  year: number;

  @ApiProperty({ example: 3000 })
  profit: number;
}

export class WeekSummaryDto {
  @ApiProperty({ example: 5 })
  totalWeeks: number;

  @ApiProperty({ example: 1500 })
  totalFlowers: number;

  @ApiProperty({ example: 10000 })
  totalBuyingPrice: number;

  @ApiProperty({ example: 25000 })
  totalSales: number;

  @ApiProperty({ example: 8000 })
  totalProfit: number;

  @ApiProperty({ example: 25000 })
  totalRevenue: number;

  @ApiProperty({ example: 5000 })
  totalSavings: number;

  @ApiProperty({ example: 1600 })
  averageProfit: number;

  @ApiProperty({ example: 5000 })
  averageRevenue: number;

  @ApiProperty({ example: 300 })
  averageFlowers: number;

  @ApiProperty({ type: BestWeekDto, nullable: true })
  bestWeek: BestWeekDto | null;
}

