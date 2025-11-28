import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from '../schemas/organization.schema';

@Injectable()
export class OrganizationIdService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  /**
   * Generate the next sequential organization ID (org_1, org_2, etc.)
   * Finds the highest existing org ID and increments it
   */
  async generateNextOrgId(): Promise<string> {
    // Find the organization with the highest orgId number
    const lastOrg = await this.organizationModel
      .findOne({ orgId: { $regex: /^org_\d+$/ } })
      .sort({ orgId: -1 })
      .exec();

    if (!lastOrg || !lastOrg.orgId) {
      // First organization
      return 'org_1';
    }

    // Extract the number from the last orgId (e.g., "org_5" -> 5)
    const match = lastOrg.orgId.match(/^org_(\d+)$/);
    if (!match) {
      // If format is unexpected, start from 1
      return 'org_1';
    }

    const lastNumber = parseInt(match[1], 10);
    const nextNumber = lastNumber + 1;
    return `org_${nextNumber}`;
  }

  /**
   * Validate that an orgId is in the correct format
   */
  isValidOrgId(orgId: string): boolean {
    return /^org_\d+$/.test(orgId);
  }
}

