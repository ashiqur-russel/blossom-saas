import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Withdrawal, WithdrawalDocument } from './schemas/withdrawal.schema';
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto';
import { WithdrawalResponseDto } from './dtos/withdrawal-response.dto';
import { WithdrawalSummaryDto } from './dtos/withdrawal-summary.dto';
import { Week, WeekDocument } from '../weeks/schemas/week.schema';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectModel(Withdrawal.name)
    private readonly withdrawalModel: Model<WithdrawalDocument>,
    @InjectModel(Week.name)
    private readonly weekModel: Model<WeekDocument>,
  ) {}

  async create(createWithdrawalDto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
    // Check available savings before allowing withdrawal
    const summary = await this.getSummary();
    
    if (createWithdrawalDto.amount > summary.availableSavings) {
      throw new BadRequestException(
        `Insufficient savings. Available: €${summary.availableSavings.toFixed(2)}, Requested: €${createWithdrawalDto.amount.toFixed(2)}`
      );
    }

    // Convert date string to Date object
    const withdrawalData = {
      ...createWithdrawalDto,
      date: new Date(createWithdrawalDto.date),
    };

    const withdrawal = await this.withdrawalModel.create(withdrawalData);
    return this.mapToResponseDto(withdrawal);
  }

  async findAll(): Promise<WithdrawalResponseDto[]> {
    const withdrawals = await this.withdrawalModel
      .find()
      .sort({ date: -1, createdAt: -1 })
      .exec();
    return withdrawals.map((w) => this.mapToResponseDto(w));
  }

  async findOne(id: string): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalModel.findById(id).exec();
    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }
    return this.mapToResponseDto(withdrawal);
  }

  async remove(id: string): Promise<void> {
    const result = await this.withdrawalModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }
  }

  async getSummary(): Promise<WithdrawalSummaryDto> {
    // Get total savings from all weeks
    const weeks = await this.weekModel.find().exec();
    const totalSavings = weeks.reduce((sum, week) => sum + (week.savings || 0), 0);

    // Get total withdrawals
    const withdrawals = await this.withdrawalModel.find().exec();
    const totalWithdrawals = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // Calculate available savings
    const availableSavings = totalSavings - totalWithdrawals;

    return {
      totalWithdrawals,
      totalSavings,
      availableSavings: Math.max(0, availableSavings), // Don't go below 0
      totalWithdrawalCount: withdrawals.length,
    };
  }

  private mapToResponseDto(withdrawal: WithdrawalDocument): WithdrawalResponseDto {
    return {
      id: withdrawal._id.toString(),
      amount: withdrawal.amount,
      date: withdrawal.date,
      description: withdrawal.description,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    };
  }
}

