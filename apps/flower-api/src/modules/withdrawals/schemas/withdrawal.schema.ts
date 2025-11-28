import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WithdrawalDocument = Withdrawal & Document;

@Schema({ timestamps: true })
export class Withdrawal {
  @Prop({ type: String, required: true, ref: 'User', index: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);

// Index for efficient user-based queries
WithdrawalSchema.index({ userId: 1 });
WithdrawalSchema.index({ userId: 1, date: -1 });



