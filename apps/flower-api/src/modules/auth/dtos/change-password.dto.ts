/**
 * Change Password DTO - Request validation for password change
 * Follows NestJS best practices: DTOs in dtos folder with validation
 */
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password (min 6 characters)',
    example: 'NewSecurePassword123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;
}

