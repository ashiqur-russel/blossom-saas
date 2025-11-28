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
import { Organization, OrganizationDocument } from '../modules/organizations/schemas/organization.schema';
import { OrgRole } from '../modules/organizations/enums/org-role.enum';
import { OrganizationIdService } from '../modules/organizations/services/organization-id.service';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const organizationModel = app.get<Model<OrganizationDocument>>(getModelToken(Organization.name));
  const organizationIdService = app.get(OrganizationIdService);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@blossom.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User';
  const adminBusinessName = process.env.ADMIN_BUSINESS_NAME || 'Blossom Admin Organization';

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

    // Generate sequential organization ID
    const orgId = await organizationIdService.generateNextOrgId();

    // Create organization for admin
    const orgName = adminBusinessName || `${adminFirstName} ${adminLastName}'s Organization`;
    const organization = await organizationModel.create({
      orgId, // Sequential ID (org_1, org_2, etc.) - immutable
      name: orgName,
      businessName: adminBusinessName,
      createdBy: null, // Will be set after user is created
      ownerId: null, // Will be set after user is created
      isActive: true,
      settings: {
        currency: 'EUR',
        timezone: 'UTC',
      },
    });

    // Create admin user with organization
    const adminUser = await userModel.create({
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      businessName: adminBusinessName,
      role: UserRole.ADMIN, // System-level admin role
      organizationId: organization.orgId, // Use orgId (org_1, org_2, etc.) instead of _id
      orgRole: OrgRole.ORG_ADMIN, // Organization-level admin role
      isActive: true,
    });

    // Update organization with admin as creator and owner
    organization.createdBy = adminUser._id.toString();
    organization.ownerId = adminUser._id.toString();
    await organization.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', `${adminFirstName} ${adminLastName}`);
    console.log('🏢 Organization:', orgName);
    console.log('🔐 System Role: ADMIN');
    console.log('🔐 Organization Role: ORG_ADMIN');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('   You can set custom admin credentials in .env:');
    console.log('   ADMIN_EMAIL=your-admin@email.com');
    console.log('   ADMIN_PASSWORD=YourSecurePassword123!');
    console.log('   ADMIN_FIRST_NAME=Your');
    console.log('   ADMIN_LAST_NAME=Name');
    console.log('   ADMIN_BUSINESS_NAME=Your Business Name');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await app.close();
    process.exit(1);
  }
}

seedAdmin();


