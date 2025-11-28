import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Company/Organization name (can be changed)',
    example: 'Blossom Flowers GmbH',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Company name must be at least 2 characters' })
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'Blossom Flowers',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Business name must not exceed 100 characters' })
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Organization description',
    example: 'A flower business specializing in fresh blooms',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  // Note: orgId is NOT included here - it's immutable and cannot be changed
}

