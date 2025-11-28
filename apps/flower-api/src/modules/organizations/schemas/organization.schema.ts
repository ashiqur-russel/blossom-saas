/**
 * Organization Schema - MongoDB Schema Definition
 * Multi-tenant organization structure for the flower business application
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'organizations',
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
export class Organization {
  // Sequential organization ID (org_1, org_2, etc.) - immutable, auto-generated
  @Prop({ type: String, required: true, unique: true, index: true, immutable: true })
  orgId: string;

  @Prop({ type: String, required: true, trim: true, index: true })
  name: string;

  @Prop({ type: String, trim: true })
  businessName?: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: String, ref: 'User', required: false, index: true })
  createdBy?: string; // User who created the organization (first ORG_ADMIN) - optional for public registration

  @Prop({ type: String, ref: 'User', index: true })
  ownerId?: string; // Primary owner/admin (can be different from createdBy)

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  settings?: {
    currency?: string;
    timezone?: string;
    dateFormat?: string;
    [key: string]: any;
  };

  @Prop({ type: Object, default: {} })
  metadata?: {
    industry?: string;
    size?: string;
    [key: string]: any;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export type OrganizationDocument = Organization & Document;

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Indexes for efficient queries
OrganizationSchema.index({ orgId: 1 }, { unique: true });
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ createdBy: 1 });
OrganizationSchema.index({ ownerId: 1 });
OrganizationSchema.index({ isActive: 1 });

