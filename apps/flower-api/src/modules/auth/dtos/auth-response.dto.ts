/**
 * Auth Response DTO - Response structure for authentication endpoints
 * Follows NestJS best practices: DTOs in dtos folder
 */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '507f1f77bcf86cd799439011',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'Blossom Flowers',
      role: 'user',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    role: UserRole;
  };
}

