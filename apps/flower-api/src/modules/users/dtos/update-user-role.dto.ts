import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrgRole } from '../../organizations/enums/org-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Organization role',
    enum: OrgRole,
    example: OrgRole.ORG_MANAGER,
  })
  @IsEnum(OrgRole, { message: 'Invalid organization role' })
  orgRole: OrgRole;
}

