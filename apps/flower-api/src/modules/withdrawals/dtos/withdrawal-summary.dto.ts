import { ApiProperty } from '@nestjs/swagger';

export class WithdrawalSummaryDto {
  @ApiProperty({ description: 'Total amount withdrawn' })
  totalWithdrawals: number;

  @ApiProperty({ description: 'Total savings from all weeks' })
  totalSavings: number;

  @ApiProperty({ description: 'Available savings (totalSavings - totalWithdrawals)' })
  availableSavings: number;

  @ApiProperty({ description: 'Number of withdrawals' })
  totalWithdrawalCount: number;
}

