import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class SaleByDay {
  @Prop({ type: Number, default: 0, min: 0 })
  thursday: number;

  @Prop({ type: Number, default: 0, min: 0 })
  friday: number;

  @Prop({ type: Number, default: 0, min: 0 })
  saturday: number;
}

export const SaleByDaySchema = SchemaFactory.createForClass(SaleByDay);

@Schema({
  collection: 'flower_weeks',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class FlowerWeek {
  @Prop({ type: Number, required: true, index: true })
  weekNumber: number;

  @Prop({ type: Number, required: true, index: true })
  year: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true, min: 0 })
  totalFlower: number; // Total flowers bought

  @Prop({ type: Number, required: true, min: 0 })
  totalBuyingPrice: number; // Total cost to buy flowers

  @Prop({ type: SaleByDaySchema, required: true })
  sale: SaleByDay; // Sales by day (Thursday, Friday, Saturday)

  @Prop({ type: Number, required: true, min: 0 })
  totalSale: number; // Total sales amount

  @Prop({ type: Number, required: true })
  profit: number; // Profit = totalSale - totalBuyingPrice

  @Prop({ type: Number, required: true, min: 0 })
  revenue: number; // Revenue (same as totalSale or can be different)

  @Prop({ type: Number, required: true, min: 0 })
  savings: number; // Savings amount

  createdAt?: Date;
  updatedAt?: Date;
}

export type FlowerWeekDocument = FlowerWeek & Document;

export const FlowerWeekSchema = SchemaFactory.createForClass(FlowerWeek);

// Compound index for unique week/year combination
FlowerWeekSchema.index({ weekNumber: 1, year: 1 }, { unique: true });
FlowerWeekSchema.index({ year: 1, weekNumber: -1 });

// Virtual for calculating profit if not provided
FlowerWeekSchema.virtual('calculatedProfit').get(function (this: FlowerWeekDocument) {
  return this.totalSale - this.totalBuyingPrice;
});
