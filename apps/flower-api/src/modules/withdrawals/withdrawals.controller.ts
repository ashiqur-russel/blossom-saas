import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { WithdrawalResponseDto } from './dtos/withdrawal-response.dto';
import { WithdrawalSummaryDto } from './dtos/withdrawal-summary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../auth/schemas/user.schema';

@ApiTags('withdrawals')
@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  create(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    @CurrentUser() user: UserDocument,
  ): Promise<WithdrawalResponseDto> {
    return this.withdrawalsService.create(createWithdrawalDto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get all withdrawals for the current user' })
  @ApiOkResponse({
    type: [WithdrawalResponseDto],
    description: 'List of all withdrawals for the current user',
  })
  findAll(@CurrentUser() user: UserDocument): Promise<WithdrawalResponseDto[]> {
    return this.withdrawalsService.findAll(user._id.toString());
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get withdrawal summary with available savings for the current user' })
  @ApiOkResponse({
    type: WithdrawalSummaryDto,
    description: 'Withdrawal summary for the current user',
  })
  getSummary(@CurrentUser() user: UserDocument): Promise<WithdrawalSummaryDto> {
    return this.withdrawalsService.getSummary(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a withdrawal by ID' })
  @ApiOkResponse({
    type: WithdrawalResponseDto,
    description: 'Withdrawal found',
  })
  @ApiNotFoundResponse({ description: 'Withdrawal not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<WithdrawalResponseDto> {
    return this.withdrawalsService.findOne(id, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a withdrawal' })
  @ApiNotFoundResponse({ description: 'Withdrawal not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    return this.withdrawalsService.remove(id, user._id.toString());
  }
}



