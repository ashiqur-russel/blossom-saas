/**
 * User Schema - MongoDB Schema Definition
 * Follows NestJS best practices: Schema in schemas folder
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrgRole } from '../../organizations/enums/org-role.enum';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ type: String, required: true, unique: true, index: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 6, select: false })
  password: string;

  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, trim: true })
  businessName?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // Organization fields
  @Prop({ type: String, ref: 'Organization', index: true })
  organizationId?: string; // Optional for backward compatibility during migration

  @Prop({ type: String, enum: OrgRole, default: OrgRole.ORG_USER })
  orgRole: OrgRole; // Role within the organization

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop({ type: String, select: false })
  refreshToken?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ organizationId: 1, orgRole: 1 });
UserSchema.index({ organizationId: 1, isActive: 1 });

