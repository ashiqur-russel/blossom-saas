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

  async create(createWithdrawalDto: CreateWithdrawalDto, userId: string): Promise<WithdrawalResponseDto> {
    // Check available savings before allowing withdrawal
    const summary = await this.getSummary(userId);
    
    if (createWithdrawalDto.amount > summary.availableSavings) {
      throw new BadRequestException(
        `Insufficient savings. Available: €${summary.availableSavings.toFixed(2)}, Requested: €${createWithdrawalDto.amount.toFixed(2)}`
      );
    }

    // Convert date string to Date object
    const withdrawalData = {
      ...createWithdrawalDto,
      userId,
      date: new Date(createWithdrawalDto.date),
    };

    const withdrawal = await this.withdrawalModel.create(withdrawalData);
    return this.mapToResponseDto(withdrawal);
  }

  async findAll(userId: string): Promise<WithdrawalResponseDto[]> {
    const withdrawals = await this.withdrawalModel
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .exec();
    return withdrawals.map((w) => this.mapToResponseDto(w));
  }

  async findOne(id: string, userId: string): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalModel.findOne({ _id: id, userId }).exec();
    if (!withdrawal) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }
    return this.mapToResponseDto(withdrawal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.withdrawalModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException(`Withdrawal with ID ${id} not found`);
    }
  }

  async getSummary(userId: string): Promise<WithdrawalSummaryDto> {
    // Get total savings from user's weeks only
    const weeks = await this.weekModel.find({ userId }).exec();
    const totalSavings = weeks.reduce((sum, week) => sum + (week.savings || 0), 0);

    // Get total withdrawals for this user only
    const withdrawals = await this.withdrawalModel.find({ userId }).exec();
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

