import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../auth/schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { OrgRole, OrgRolePermissions } from '../organizations/enums/org-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, organizationId: string, creatorOrgRole: OrgRole, creatorSystemRole?: string): Promise<UserResponseDto> {
    // Check if user has permission to create users
    // System admins (UserRole.ADMIN) can always create users
    const isSystemAdmin = creatorSystemRole === 'admin';
    const permissions = OrgRolePermissions[creatorOrgRole];
    
    if (!isSystemAdmin && !permissions?.canCreateUsers) {
      throw new ForbiddenException('You do not have permission to create users');
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      email: createUserDto.email.toLowerCase() 
    }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const userData: Partial<User> = {
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      organizationId,
      orgRole: createUserDto.orgRole || OrgRole.ORG_USER,
      role: UserRole.USER, // System role
      isActive: true,
    };

    const createdUser = await this.userModel.create(userData);
    return this.mapToResponseDto(createdUser);
  }

  async findAll(organizationId: string, requesterOrgRole: OrgRole): Promise<UserResponseDto[]> {
    // Check if user has permission to view users
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canViewUsers) {
      throw new ForbiddenException('You do not have permission to view users');
    }

    const users = await this.userModel
      .find({ organizationId, isActive: true })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .exec();

    return users.map((user) => this.mapToResponseDto(user));
  }

  async findOne(id: string, organizationId: string, requesterOrgRole: OrgRole): Promise<UserResponseDto> {
    // Check if user has permission to view users
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canViewUsers) {
      throw new ForbiddenException('You do not have permission to view users');
    }

    const user = await this.userModel
      .findOne({ _id: id, organizationId })
      .select('-password -refreshToken')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(user);
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateUserRoleDto,
    organizationId: string,
    requesterOrgRole: OrgRole,
    requesterUserId: string,
  ): Promise<UserResponseDto> {
    // Check if user has permission to manage roles
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canManageRoles) {
      throw new ForbiddenException('You do not have permission to manage user roles');
    }

    const user = await this.userModel
      .findOne({ _id: id, organizationId })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent users from changing their own role
    if (user._id.toString() === requesterUserId) {
      throw new ForbiddenException('You cannot change your own role');
    }

    // Prevent changing the last ORG_ADMIN's role
    if (user.orgRole === OrgRole.ORG_ADMIN && updateRoleDto.orgRole !== OrgRole.ORG_ADMIN) {
      const adminCount = await this.userModel.countDocuments({
        organizationId,
        orgRole: OrgRole.ORG_ADMIN,
        isActive: true,
        _id: { $ne: id },
      }).exec();

      if (adminCount === 0) {
        throw new ForbiddenException('Cannot change role: Organization must have at least one admin');
      }
    }

    user.orgRole = updateRoleDto.orgRole;
    await user.save();

    return this.mapToResponseDto(user);
  }

  async remove(id: string, organizationId: string, requesterOrgRole: OrgRole, requesterUserId: string): Promise<void> {
    // Check if user has permission to delete users
    const permissions = OrgRolePermissions[requesterOrgRole];
    if (!permissions?.canDeleteUsers) {
      throw new ForbiddenException('You do not have permission to delete users');
    }

    const user = await this.userModel
      .findOne({ _id: id, organizationId })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent users from deleting themselves
    if (user._id.toString() === requesterUserId) {
      throw new ForbiddenException('You cannot delete yourself');
    }

    // Prevent deleting the last ORG_ADMIN
    if (user.orgRole === OrgRole.ORG_ADMIN) {
      const adminCount = await this.userModel.countDocuments({
        organizationId,
        orgRole: OrgRole.ORG_ADMIN,
        isActive: true,
        _id: { $ne: id },
      }).exec();

      if (adminCount === 0) {
        throw new ForbiddenException('Cannot delete user: Organization must have at least one admin');
      }
    }

    // Soft delete - set isActive to false
    user.isActive = false;
    await user.save();
  }

  private mapToResponseDto(user: UserDocument): UserResponseDto {
    const plain: any = user.toJSON ? user.toJSON() : user.toObject();
    return {
      id: plain.id || (plain._id ? plain._id.toString() : user._id.toString()),
      email: plain.email,
      firstName: plain.firstName,
      lastName: plain.lastName,
      businessName: plain.businessName,
      role: plain.role,
      organizationId: plain.organizationId,
      orgRole: plain.orgRole || OrgRole.ORG_USER,
      isActive: plain.isActive,
      lastLoginAt: plain.lastLoginAt,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}

