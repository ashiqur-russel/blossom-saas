import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateFlowerWeekRequestDTO,
  FlowerWeekResponseDTO,
  FlowerWeekSummaryResponseDTO,
  UpdateFlowerWeekRequestDTO,
} from './dto/flower-business.dto';
import { FlowerWeek, FlowerWeekDocument } from './schema/flower-week.schema';

@Injectable()
export class FlowerBusinessService {
  constructor(
    @InjectModel(FlowerWeek.name)
    private readonly flowerWeekModel: Model<FlowerWeekDocument>,
  ) {}

  async create(
    createFlowerWeekDto: CreateFlowerWeekRequestDTO,
  ): Promise<FlowerWeekResponseDTO> {
    const existingWeek = await this.flowerWeekModel
      .findOne({
        weekNumber: createFlowerWeekDto.weekNumber,
        year: createFlowerWeekDto.year,
      })
      .exec();

    if (existingWeek) {
      throw new ConflictException(
        `Week ${createFlowerWeekDto.weekNumber} for year ${createFlowerWeekDto.year} already exists.`,
      );
    }

    const createdWeek = await this.flowerWeekModel.create(createFlowerWeekDto);
    return this.mapToDTO(createdWeek);
  }

  async findAll(): Promise<FlowerWeekResponseDTO[]> {
    const weeks = await this.flowerWeekModel
      .find()
      .sort({ year: -1, weekNumber: -1 })
      .exec();
    return weeks.map((week) => this.mapToDTO(week));
  }

  async findOne(id: string): Promise<FlowerWeekResponseDTO> {
    const week = await this.flowerWeekModel.findById(id).exec();
    if (!week) {
      throw new NotFoundException(`Flower week with ID ${id} not found`);
    }
    return this.mapToDTO(week);
  }

  async findByWeekAndYear(
    weekNumber: number,
    year: number,
  ): Promise<FlowerWeekResponseDTO | null> {
    const week = await this.flowerWeekModel
      .findOne({ weekNumber, year })
      .exec();
    if (!week) {
      return null;
    }
    return this.mapToDTO(week);
  }

  async update(
    id: string,
    dto: UpdateFlowerWeekRequestDTO,
  ): Promise<FlowerWeekResponseDTO> {
    // Handle partial sale update - merge with existing sale if only partial sale is provided
    const updateData: any = { ...dto };
    if (dto.sale) {
      const existingWeek = await this.flowerWeekModel.findById(id).select('sale').lean().exec();
      if (existingWeek && existingWeek.sale) {
        updateData.sale = {
          ...existingWeek.sale,
          ...dto.sale,
        };
      }
    }

    const week = await this.flowerWeekModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    if (!week) {
      throw new NotFoundException(`Flower week with ID ${id} not found`);
    }
    return this.mapToDTO(week);
  }

  async remove(id: string): Promise<void> {
    const result = await this.flowerWeekModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Flower week with ID ${id} not found`);
    }
  }

  async getSummary(): Promise<FlowerWeekSummaryResponseDTO> {
    const weeks = await this.flowerWeekModel.find().exec();

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
      averageFlowers: totalFlowers / weeks.length,
      bestWeek,
    };
  }

  private mapToDTO(week: FlowerWeekDocument): FlowerWeekResponseDTO {
    const plain: any = week.toObject();
    
    // Handle both old and new data formats
    const totalFlower = plain.totalFlower || plain.quantity || 0;
    const totalBuyingPrice = plain.totalBuyingPrice || (plain.quantity && plain.price ? plain.quantity * plain.price : 0) || 0;
    const sale = plain.sale || { thursday: 0, friday: 0, saturday: 0 };
    const totalSale = plain.totalSale || (plain.quantity && plain.price ? plain.quantity * plain.price : 0) || 0;
    const profit = plain.profit || 0;
    const revenue = plain.revenue || totalSale;
    const savings = plain.savings || 0;
    
    return {
      id: plain.id,
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
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
