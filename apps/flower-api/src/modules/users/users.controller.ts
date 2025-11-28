import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../auth/schemas/user.schema';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user in your organization' })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: UserDocument,
  ): Promise<UserResponseDto> {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    return this.usersService.create(createUserDto, user.organizationId, user.orgRole, user.role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in your organization' })
  @ApiOkResponse({
    type: [UserResponseDto],
    description: 'List of all users in your organization',
  })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll(@CurrentUser() user: UserDocument): Promise<UserResponseDto[]> {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    return this.usersService.findAll(user.organizationId, user.orgRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User found',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<UserResponseDto> {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    return this.usersService.findOne(id, user.organizationId, user.orgRole);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update a user\'s organization role' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User role updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
    @CurrentUser() user: UserDocument,
  ): Promise<UserResponseDto> {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }

    return this.usersService.updateRole(id, updateRoleDto, user.organizationId, user.orgRole, user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<void> {
    if (!user.organizationId) {
      throw new ForbiddenException('User must belong to an organization');
    }
    return this.usersService.remove(id, user.organizationId, user.orgRole, user._id.toString());
  }
}

