import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrgRole, OrgRolePermissions } from './enums/org-role.enum';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  /**
   * Get organization by orgId
   * Users can only access their own organization
   */
  async findOne(orgId: string, requesterOrgId: string, requesterOrgRole: OrgRole): Promise<OrganizationDocument> {
    // Check permissions - only ORG_ADMIN and ORG_MANAGER can view organization settings
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canViewOrganizationSettings) {
      throw new ForbiddenException('You do not have permission to view organization settings');
    }

    // Users can only access their own organization
    if (orgId !== requesterOrgId) {
      throw new ForbiddenException('You can only access your own organization');
    }

    const organization = await this.organizationModel.findOne({ orgId }).exec();
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${orgId} not found`);
    }

    return organization;
  }

  /**
   * Update organization (company name, business name, description)
   * orgId cannot be changed (immutable)
   */
  async update(
    orgId: string,
    updateDto: UpdateOrganizationDto,
    requesterOrgId: string,
    requesterOrgRole: OrgRole,
  ): Promise<OrganizationDocument> {
    // Check permissions - only ORG_ADMIN can manage organization
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canManageOrganization) {
      throw new ForbiddenException('You do not have permission to manage organization settings');
    }

    // Users can only update their own organization
    if (orgId !== requesterOrgId) {
      throw new ForbiddenException('You can only update your own organization');
    }

    const organization = await this.organizationModel
      .findOneAndUpdate(
        { orgId },
        { $set: updateDto },
        { new: true, runValidators: true }
      )
      .exec();

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${orgId} not found`);
    }

    return organization;
  }

  /**
   * Get organization by orgId (for internal use)
   */
  async findByOrgId(orgId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOne({ orgId }).exec();
  }
}

