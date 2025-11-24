import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { JwtPayload } from './strategies/jwt.strategy';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    role: UserRole;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, businessName } = registerDto;

    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const userData: Partial<User> & { email: string; password: string; firstName: string; lastName: string; role: UserRole; isActive: boolean } = {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
      isActive: true,
    };

    if (businessName && businessName.trim()) {
      userData.businessName = businessName.trim();
    }

            const createdUser: any = await this.userModel.create(userData);
            const user = createdUser as UserDocument;

            const accessToken = this.generateToken(user);
            const refreshToken = this.generateRefreshToken(user);

            user.refreshToken = refreshToken;
            await user.save();

            return {
              accessToken,
              refreshToken,
              user: this.sanitizeUser(user),
            } as AuthResponse;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const userResult: any = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!userResult) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = userResult as UserDocument;
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

            user.lastLoginAt = new Date();

            const userDoc = user;
            const accessToken = this.generateToken(userDoc);
            const refreshToken = this.generateRefreshToken(userDoc);

            user.refreshToken = refreshToken;
            await user.save();

            return {
              accessToken,
              refreshToken,
              user: this.sanitizeUser(user),
            } as AuthResponse;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const userResult: any = await this.userModel.findById(userId).select('+password');
    if (!userResult) {
      throw new UnauthorizedException('User not found');
    }

    const userDoc = userResult as UserDocument;
    const isPasswordValid = await this.verifyPassword(currentPassword, userDoc.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    userDoc.password = await this.hashPassword(newPassword);
    await userDoc.save();

    return { message: 'Password changed successfully' };
  }

  async validateUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  async validateRefreshToken(refreshToken: string): Promise<UserDocument | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key-change-in-production',
      });

      if (payload.type !== 'refresh') {
        return null;
      }

      const userResult: any = await this.userModel.findById(payload.sub).select('+refreshToken');
      if (!userResult || !userResult.isActive || userResult.refreshToken !== refreshToken) {
        return null;
      }

      return userResult as UserDocument;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(userId: string, refreshToken: string) {
    const userResult: any = await this.userModel.findById(userId).select('+refreshToken');
    if (!userResult || !userResult.isActive || userResult.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userDoc = userResult as UserDocument;
    const newAccessToken = this.generateToken(userDoc);
    const newRefreshToken = this.generateRefreshToken(userDoc);

    userDoc.refreshToken = newRefreshToken;
    await userDoc.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const userResult: any = await this.userModel.findById(userId);
    if (userResult) {
      const userDoc = userResult as UserDocument;
      userDoc.refreshToken = undefined;
      await userDoc.save();
    }
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const userResult: any = await this.userModel.findById(userId);
    if (!userResult) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(userResult as UserDocument);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(user: UserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
    return this.jwtService.sign(payload as any, {
      expiresIn: expiresIn as any,
    } as any);
  }

  private generateRefreshToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      type: 'refresh',
    };
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    return this.jwtService.sign(payload as any, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key-change-in-production',
      expiresIn: expiresIn as any,
    } as any);
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    return {
      id: userObj._id.toString(),
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      businessName: userObj.businessName,
      role: userObj.role,
      isActive: userObj.isActive,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
  }
}

