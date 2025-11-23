import { IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWithdrawalDto {
  @ApiProperty({ description: 'Withdrawal amount', example: 100.50 })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({ description: 'Withdrawal date (ISO string)', example: '2024-01-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Optional description', example: 'Equipment purchase' })
  @IsOptional()
  @IsString()
  description?: string;
}

