/**
 * Week Schema - MongoDB Schema Definition
 * Follows NestJS best practices: Schema in schemas folder
 */
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
export class Week {
  @Prop({ type: Number, required: true, index: true })
  weekNumber: number;

  @Prop({ type: Number, required: true, index: true })
  year: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true, min: 0 })
  totalFlower: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalBuyingPrice: number;

  @Prop({ type: SaleByDaySchema, required: true })
  sale: SaleByDay;

  @Prop({ type: Number, required: true, min: 0 })
  totalSale: number;

  @Prop({ type: Number, required: true })
  profit: number;

  @Prop({ type: Number, required: true, min: 0 })
  revenue: number;

  @Prop({ type: Number, required: true, min: 0 })
  savings: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type WeekDocument = Week & Document;

export const WeekSchema = SchemaFactory.createForClass(Week);

// Compound index for unique week/year combination
WeekSchema.index({ weekNumber: 1, year: 1 }, { unique: true });
WeekSchema.index({ year: 1, weekNumber: -1 });


