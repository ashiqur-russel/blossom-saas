import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WithdrawalDocument = Withdrawal & Document;

@Schema({ timestamps: true })
export class Withdrawal {
  // User who created/owns this record
  @Prop({ type: String, required: true, ref: 'User', index: true })
  userId: string;

  // Organization this record belongs to (for multi-tenant filtering)
  @Prop({ type: String, required: true, ref: 'Organization', index: true })
  organizationId: string;

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

// Indexes for efficient queries
// User-based queries
WithdrawalSchema.index({ userId: 1 });
WithdrawalSchema.index({ userId: 1, date: -1 });
// Organization-based queries (primary for multi-tenant)
WithdrawalSchema.index({ organizationId: 1 });
WithdrawalSchema.index({ organizationId: 1, date: -1 });
WithdrawalSchema.index({ organizationId: 1, userId: 1 });



