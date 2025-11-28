import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrgRole } from '../../organizations/enums/org-role.enum';
import { UserRole } from '../../auth/schemas/user.schema';

export class UserResponseDto {
  @ApiProperty({ example: '65b23c60a7b1c2d3e4f5a6b7' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'Blossom Flowers' })
  businessName?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiPropertyOptional({ example: '65b23c60a7b1c2d3e4f5a6b8' })
  organizationId?: string;

  @ApiProperty({ enum: OrgRole, example: OrgRole.ORG_USER })
  orgRole: OrgRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: '2025-01-01T10:00:00.000Z' })
  lastLoginAt?: Date;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  updatedAt: Date;
}

