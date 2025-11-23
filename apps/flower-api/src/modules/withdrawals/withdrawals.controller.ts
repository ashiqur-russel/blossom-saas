import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { WithdrawalResponseDto } from './dtos/withdrawal-response.dto';
import { WithdrawalSummaryDto } from './dtos/withdrawal-summary.dto';

@ApiTags('withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new withdrawal' })
  @ApiCreatedResponse({
    type: WithdrawalResponseDto,
    description: 'Withdrawal created successfully',
  })
  @ApiBadRequestResponse({ description: 'Insufficient savings' })
  create(@Body() createWithdrawalDto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    return this.withdrawalsService.create(createWithdrawalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all withdrawals' })
  @ApiOkResponse({
    type: [WithdrawalResponseDto],
    description: 'List of all withdrawals',
  })
  findAll(): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalsService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get withdrawal summary with available savings' })
  @ApiOkResponse({
    type: WithdrawalSummaryDto,
    description: 'Withdrawal summary',
  })
  getSummary(): Promise<WithdrawalSummaryDto> {
    return this.withdrawalsService.getSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a withdrawal by ID' })
  @ApiOkResponse({
    type: WithdrawalResponseDto,
    description: 'Withdrawal found',
  })
  @ApiNotFoundResponse({ description: 'Withdrawal not found' })
  findOne(@Param('id') id: string): Promise<WithdrawalResponseDto> {
    return this.withdrawalsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a withdrawal' })
  @ApiNotFoundResponse({ description: 'Withdrawal not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.withdrawalsService.remove(id);
  }
}

