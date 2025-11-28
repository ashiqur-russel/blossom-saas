/**
 * Weeks Service - Business Logic
 * Follows NestJS best practices: Service contains business logic
 */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Week, WeekDocument } from './schemas/week.schema';
import { CreateWeekDto } from './dtos/create-week.dto';
import { UpdateWeekDto } from './dtos/update-week.dto';
import { WeekResponseDto } from './dtos/week-response.dto';
import { WeekSummaryDto } from './dtos/week-summary.dto';

@Injectable()
export class WeeksService {
  constructor(
    @InjectModel(Week.name)
    private readonly weekModel: Model<WeekDocument>,
  ) {}

  async create(createWeekDto: CreateWeekDto, userId: string, organizationId?: string): Promise<WeekResponseDto> {
    if (!organizationId) {
      throw new ConflictException('Organization ID is required. Please ensure your user account is associated with an organization.');
    }

    // Check if week already exists for this organization (not just user)
    // This prevents duplicate weeks within the same organization
    const existingWeek = await this.weekModel
      .findOne({
        organizationId,
        weekNumber: createWeekDto.weekNumber,
        year: createWeekDto.year,
      })
      .exec();

    if (existingWeek) {
      throw new ConflictException(
        `Week ${createWeekDto.weekNumber} for year ${createWeekDto.year} already exists for this organization.`,
      );
    }

    let avgBuyingPrice = createWeekDto.totalFlower > 0 
      ? createWeekDto.totalBuyingPrice / createWeekDto.totalFlower 
      : 0;
    let avgSalesPrice = createWeekDto.totalFlower > 0 
      ? createWeekDto.totalSale / createWeekDto.totalFlower 
      : 0;

    avgBuyingPrice = Math.round(avgBuyingPrice * 100) / 100;
    avgSalesPrice = Math.round(avgSalesPrice * 100) / 100;

    const weekData: any = {
      weekNumber: createWeekDto.weekNumber,
      year: createWeekDto.year,
      startDate: createWeekDto.startDate,
      endDate: createWeekDto.endDate,
      totalFlower: createWeekDto.totalFlower,
      totalBuyingPrice: createWeekDto.totalBuyingPrice,
      sale: createWeekDto.sale,
      totalSale: createWeekDto.totalSale,
      profit: createWeekDto.profit,
      revenue: createWeekDto.revenue,
      userId,
      organizationId,
      avgBuyingPrice,
      avgSalesPrice,
      savings: createWeekDto.savings ?? 0,
    };
    const createdWeek = await this.weekModel.create(weekData);
    return this.mapToResponseDto(createdWeek as any as WeekDocument);
  }

  async findAll(userId: string): Promise<WeekResponseDto[]> {
    const weeks = await this.weekModel
      .find({ userId })
      .sort({ year: -1, weekNumber: -1 })
      .lean()
      .exec();
    const result: WeekResponseDto[] = [];
    for (const week of weeks) {
      result.push(this.mapToResponseDto(week as any as WeekDocument));
    }
    return result;
  }

  async findOne(id: string, userId: string): Promise<WeekResponseDto> {
    const week = await this.weekModel.findOne({ _id: id, userId }).exec();
    if (!week) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }
    return this.mapToResponseDto(week as any as WeekDocument);
  }

  async update(
    id: string,
    updateWeekDto: UpdateWeekDto,
    userId: string,
  ): Promise<WeekResponseDto> {
    // Handle partial sale update
    if (updateWeekDto.sale) {
      const existingWeek = await this.weekModel.findOne({ _id: id, userId }).select('sale').lean().exec();
      if (existingWeek && existingWeek.sale) {
        updateWeekDto.sale = {
          ...existingWeek.sale,
          ...updateWeekDto.sale,
        };
      }
    }

    // Get existing week to calculate averages
    const existingWeek = await this.weekModel.findOne({ _id: id, userId }).exec();
    if (!existingWeek) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }

    // Recalculate averages if relevant fields were updated
    const needsRecalculation = 
      updateWeekDto.totalFlower !== undefined || 
      updateWeekDto.totalBuyingPrice !== undefined || 
      updateWeekDto.totalSale !== undefined;

    if (needsRecalculation) {
      const totalFlower = updateWeekDto.totalFlower ?? existingWeek.totalFlower;
      const totalBuyingPrice = updateWeekDto.totalBuyingPrice ?? existingWeek.totalBuyingPrice;
      const totalSale = updateWeekDto.totalSale ?? existingWeek.totalSale;

      let avgBuyingPrice = totalFlower > 0 ? totalBuyingPrice / totalFlower : 0;
      let avgSalesPrice = totalFlower > 0 ? totalSale / totalFlower : 0;

      avgBuyingPrice = Math.round(avgBuyingPrice * 100) / 100;
      avgSalesPrice = Math.round(avgSalesPrice * 100) / 100;

      updateWeekDto.avgBuyingPrice = avgBuyingPrice;
      updateWeekDto.avgSalesPrice = avgSalesPrice;
    }

    const week = await this.weekModel
      .findOneAndUpdate({ _id: id, userId }, updateWeekDto, { new: true, runValidators: true })
      .exec();

    if (!week) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }

    return this.mapToResponseDto(week as any as WeekDocument);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.weekModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }
  }

  async getSummary(userId: string): Promise<WeekSummaryDto> {
    const weeks = await this.weekModel.find({ userId }).exec();

    if (weeks.length === 0) {
      return {
        totalWeeks: 0,
        totalFlowers: 0,
        totalBuyingPrice: 0,
        totalSales: 0,
        totalProfit: 0,
        totalRevenue: 0,
        totalSavings: 0,
        averageProfit: 0,
        averageRevenue: 0,
        averageFlowers: 0,
        bestWeek: null,
      };
    }

    // Handle both old and new data formats
    const totalFlowers = weeks.reduce((sum, w: any) => {
      return sum + (w.totalFlower || w.quantity || 0);
    }, 0);

    const totalBuyingPrice = weeks.reduce((sum, w: any) => {
      return sum + (w.totalBuyingPrice || (w.quantity && w.price ? w.quantity * w.price : 0) || 0);
    }, 0);

    const totalSales = weeks.reduce((sum, w: any) => {
      return sum + (w.totalSale || (w.quantity && w.price ? w.quantity * w.price : 0) || 0);
    }, 0);

    const totalProfit = weeks.reduce((sum, w: any) => sum + (w.profit || 0), 0);
    const totalRevenue = weeks.reduce((sum, w: any) => {
      return sum + (w.revenue || w.totalSale || (w.quantity && w.price ? w.quantity * w.price : 0) || 0);
    }, 0);

    const totalSavings = weeks.reduce((sum, w: any) => sum + (w.savings || 0), 0);

    const bestWeek = weeks.reduce((best, week: any) => {
      const profit = week.profit || 0;
      if (!best || profit > best.profit) {
        return {
          weekNumber: week.weekNumber,
          year: week.year,
          profit: profit,
        };
      }
      return best;
    }, null as { weekNumber: number; year: number; profit: number } | null);

    return {
      totalWeeks: weeks.length,
      totalFlowers,
      totalBuyingPrice,
      totalSales,
      totalProfit,
      totalRevenue,
      totalSavings,
      averageProfit: totalProfit / weeks.length,
      averageRevenue: totalRevenue / weeks.length,
      averageFlowers: totalFlowers / weeks.length,
      bestWeek,
    };
  }

  private mapToResponseDto(week: WeekDocument | any): WeekResponseDto {
    // Handle both Mongoose documents and plain objects (from .lean())
    const plain: any = week.toJSON ? week.toJSON() : (week.toObject ? week.toObject() : week);

    // Handle both old and new data formats
    const totalFlower = plain.totalFlower || plain.quantity || 0;
    const totalBuyingPrice = plain.totalBuyingPrice || (plain.quantity && plain.price ? plain.quantity * plain.price : 0) || 0;
    const sale = plain.sale || { thursday: 0, friday: 0, saturday: 0 };
    const totalSale = plain.totalSale || (plain.quantity && plain.price ? plain.quantity * plain.price : 0) || 0;
    const profit = plain.profit || 0;
    const revenue = plain.revenue || totalSale;
    const savings = plain.savings || 0;
    const id = plain.id || (plain._id ? plain._id.toString() : (week && week._id ? week._id.toString() : ''));

    let avgBuyingPrice = totalFlower > 0 ? totalBuyingPrice / totalFlower : 0;
    let avgSalesPrice = totalFlower > 0 ? totalSale / totalFlower : 0;

    avgBuyingPrice = plain.avgBuyingPrice ?? avgBuyingPrice;
    avgSalesPrice = plain.avgSalesPrice ?? avgSalesPrice;

    avgBuyingPrice = Math.round(avgBuyingPrice * 100) / 100;
    avgSalesPrice = Math.round(avgSalesPrice * 100) / 100;

    return {
      id,
      weekNumber: plain.weekNumber,
      year: plain.year,
      startDate: plain.startDate,
      endDate: plain.endDate,
      totalFlower,
      totalBuyingPrice,
      sale,
      totalSale,
      profit,
      revenue,
      savings,
      avgBuyingPrice,
      avgSalesPrice,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
