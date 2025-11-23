import { ApiProperty } from '@nestjs/swagger';

export class SaleByDayResponseDto {
  @ApiProperty({ example: 100 })
  thursday: number;

  @ApiProperty({ example: 150 })
  friday: number;

  @ApiProperty({ example: 200 })
  saturday: number;
}

export class WeekResponseDto {
  @ApiProperty({ example: '65b23c60a7b1c2d3e4f5a6b7' })
  id: string;

  @ApiProperty({ example: 1 })
  weekNumber: number;

  @ApiProperty({ example: 2025 })
  year: number;

  @ApiProperty({ example: '2025-01-06T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-01-12T23:59:59.999Z' })
  endDate: Date;

  @ApiProperty({ example: 280 })
  totalFlower: number;

  @ApiProperty({ example: 5000 })
  totalBuyingPrice: number;

  @ApiProperty({ type: SaleByDayResponseDto })
  sale: SaleByDayResponseDto;

  @ApiProperty({ example: 8000 })
  totalSale: number;

  @ApiProperty({ example: 3000 })
  profit: number;

  @ApiProperty({ example: 8000 })
  revenue: number;

  @ApiProperty({ example: 500 })
  savings: number;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  updatedAt: Date;
}

