/**
 * Seed User Script
 * Creates a regular user for the application
 * Run with: npm run seed:user
 */
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { User, UserDocument, UserRole } from '../modules/auth/schemas/user.schema';

async function seedUserData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  const userEmail = process.env.USER_EMAIL || 'user@user.com';
  const userPassword = process.env.USER_PASSWORD || '123456';
  const userFirstName = process.env.USER_FIRST_NAME || 'Carl';
  const userLastName = process.env.USER_LAST_NAME || 'User';
  const businessName = process.env.USER_BUSINESS_NAME || 'Blossom Flowers';

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: userEmail });
    if (existingUser) {
      console.log('✅ User already exists:', userEmail);
      console.log('   To create a new user, change USER_EMAIL in .env or delete existing user');
      await app.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create user
    const user = await userModel.create({
      email: userEmail.toLowerCase(),
      password: hashedPassword,
      firstName: userFirstName,
      lastName: userLastName,
      businessName: businessName,
      role: UserRole.USER,
      isActive: true,
    });

    console.log('✅ User created successfully!');
    console.log('📧 Email:', userEmail);
    console.log('🔑 Password:', userPassword);
    console.log('👤 Name:', `${userFirstName} ${userLastName}`);
    console.log('🏢 Business:', businessName);
    console.log('🔐 Role: USER');
    console.log('');
    console.log('📝 You can now login with these credentials');
    console.log('   You can set custom user credentials in .env:');
    console.log('   USER_EMAIL=your-user@email.com');
    console.log('   USER_PASSWORD=YourSecurePassword123!');
    console.log('   USER_FIRST_NAME=Your');
    console.log('   USER_LAST_NAME=Name');
    console.log('   USER_BUSINESS_NAME=Your Business Name');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    await app.close();
    process.exit(1);
  }
}

seedUserData();

