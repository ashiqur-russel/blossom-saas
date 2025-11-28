import { ApiProperty } from '@nestjs/swagger';
import { WeekResponseDto } from './week-response.dto';
import { WeekSummaryDto } from './week-summary.dto';
import { WithdrawalSummaryDto } from '../../withdrawals/dtos/withdrawal-summary.dto';

export class DashboardResponseDto {
  @ApiProperty({ type: [WeekResponseDto], description: 'List of all weeks' })
  weeks: WeekResponseDto[];

  @ApiProperty({ type: WeekSummaryDto, description: 'Summary statistics' })
  summary: WeekSummaryDto;

  @ApiProperty({ type: WithdrawalSummaryDto, nullable: true, description: 'Withdrawal summary (optional)' })
  withdrawalSummary: WithdrawalSummaryDto | null;
}

