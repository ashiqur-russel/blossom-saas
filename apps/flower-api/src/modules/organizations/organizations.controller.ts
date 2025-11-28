import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../auth/schemas/user.schema';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':orgId')
  @ApiOperation({ summary: 'Get organization details' })
  @ApiOkResponse({ description: 'Organization found' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findOne(
    @Param('orgId') orgId: string,
    @CurrentUser() user: UserDocument,
  ) {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    // Get orgId from user's organization
    return this.organizationsService.findOne(orgId, user.organizationId, user.orgRole);
  }

  @Patch(':orgId')
  @ApiOperation({ summary: 'Update organization (company name, etc.)' })
  @ApiOkResponse({ description: 'Organization updated successfully' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions or cannot change orgId' })
  update(
    @Param('orgId') orgId: string,
    @Body() updateDto: UpdateOrganizationDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    // Users can only update their own organization
    return this.organizationsService.update(orgId, updateDto, user.organizationId, user.orgRole);
  }
}

