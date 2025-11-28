/**
 * Migration Script: Add organizations to existing users
 * 
 * This script:
 * 1. Creates an organization for each user that doesn't have one
 * 2. Assigns users to their organization with ORG_ADMIN role
 * 3. Updates existing Week and Withdrawal records with organizationId
 * 
 * Run with: npm run migrate:users
 */
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../modules/auth/schemas/user.schema';
import { Organization, OrganizationSchema } from '../modules/organizations/schemas/organization.schema';
import { Week, WeekSchema } from '../modules/weeks/schemas/week.schema';
import { Withdrawal, WithdrawalSchema } from '../modules/withdrawals/schemas/withdrawal.schema';
import { OrgRole } from '../modules/organizations/enums/org-role.enum';
import { OrganizationIdService } from '../modules/organizations/services/organization-id.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL') || 'mongodb://localhost:28018/flower-business',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Week.name, schema: WeekSchema },
      { name: Withdrawal.name, schema: WithdrawalSchema },
    ]),
  ],
  providers: [OrganizationIdService],
})
class MigrationModule {}

async function migrateUsersToOrganizations() {
  const app = await NestFactory.createApplicationContext(MigrationModule);
  const userModel = app.get('UserModel') as any;
  const organizationModel = app.get('OrganizationModel') as any;
  const weekModel = app.get('WeekModel') as any;
  const withdrawalModel = app.get('WithdrawalModel') as any;
  const organizationIdService = app.get(OrganizationIdService) as OrganizationIdService;

  console.log('🚀 Starting user to organization migration...\n');

  try {
    // Get all users without organizationId
    const usersWithoutOrg = await userModel.find({ 
      $or: [
        { organizationId: { $exists: false } },
        { organizationId: null },
      ]
    }).exec();

    console.log(`📊 Found ${usersWithoutOrg.length} users without organizations\n`);

    if (usersWithoutOrg.length === 0) {
      console.log('✅ All users already have organizations. Migration not needed.');
      await app.close();
      return;
    }

    let orgsCreated = 0;
    let usersUpdated = 0;
    let weeksUpdated = 0;
    let withdrawalsUpdated = 0;

    for (const user of usersWithoutOrg) {
      const userId = user._id.toString();
      const userName = `${user.firstName} ${user.lastName}`.trim() || user.email;
      const orgName = user.businessName || `${userName}'s Organization`;

      console.log(`\n👤 Processing user: ${userName} (${user.email})`);

      // Generate sequential organization ID
      const orgId = await organizationIdService.generateNextOrgId();

      // Create organization for this user
      const organization = await organizationModel.create({
        orgId, // Sequential ID (org_1, org_2, etc.) - immutable
        name: orgName,
        businessName: user.businessName,
        createdBy: userId,
        ownerId: userId,
        isActive: true,
        settings: {
          currency: 'EUR',
          timezone: 'UTC',
        },
      });

      console.log(`   ✅ Created organization: ${orgName} (${orgId})`);

      // Update user with organizationId and appropriate role
      // If user is system ADMIN, they should also be ORG_ADMIN in their organization
      // Regular users also become ORG_ADMIN of their own organization
      const updateData: any = {
        organizationId: orgId,
        orgRole: OrgRole.ORG_ADMIN, // All migrated users become org admins of their own org
      };
      
      await userModel.updateOne(
        { _id: userId },
        { $set: updateData }
      );
      
      const roleInfo = user.role === 'admin' ? 'System ADMIN + ORG_ADMIN' : 'ORG_ADMIN';
      console.log(`   ✅ Updated user with organizationId and ${roleInfo} role`);

      // Update all weeks for this user
      const weeksResult = await weekModel.updateMany(
        { userId: userId },
        { $set: { organizationId: orgId } }
      );
      if (weeksResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${weeksResult.modifiedCount} week records`);
        weeksUpdated += weeksResult.modifiedCount;
      }

      // Update all withdrawals for this user
      const withdrawalsResult = await withdrawalModel.updateMany(
        { userId: userId },
        { $set: { organizationId: orgId } }
      );
      if (withdrawalsResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${withdrawalsResult.modifiedCount} withdrawal records`);
        withdrawalsUpdated += withdrawalsResult.modifiedCount;
      }

      orgsCreated++;
      usersUpdated++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Organizations created: ${orgsCreated}`);
    console.log(`✅ Users updated: ${usersUpdated}`);
    console.log(`✅ Week records updated: ${weeksUpdated}`);
    console.log(`✅ Withdrawal records updated: ${withdrawalsUpdated}`);
    console.log('='.repeat(60));
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    throw error;
  } finally {
    await app.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

migrateUsersToOrganizations()
  .then(() => {
    console.log('\n✨ Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

