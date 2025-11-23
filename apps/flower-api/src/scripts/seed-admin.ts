/**
 * Seed Admin User Script
 * Creates a default admin user for the application
 * Run with: npm run seed:admin
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../modules/auth/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.de';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

  try {
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      console.log('   To create a new admin, change ADMIN_EMAIL in .env or delete existing admin');
      await app.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user (without businessName)
    const adminUser = await userModel.create({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      // businessName is optional - not set for admin
      role: UserRole.ADMIN,
      isActive: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', `${adminFirstName} ${adminLastName}`);
    console.log('🔐 Role: ADMIN');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('   You can set custom admin credentials in .env:');
    console.log('   ADMIN_EMAIL=your-admin@email.com');
    console.log('   ADMIN_PASSWORD=YourSecurePassword123!');
    console.log('   ADMIN_FIRST_NAME=Your');
    console.log('   ADMIN_LAST_NAME=Name');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await app.close();
    process.exit(1);
  }
}

seedAdmin();

