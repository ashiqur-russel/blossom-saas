/**
 * Migration Script: Convert organizationId from orgId string to ObjectId reference
 * 
 * This script migrates existing user and week documents to use MongoDB ObjectId references
 * instead of orgId strings (org_1, org_2, etc.)
 * 
 * Run with: npx ts-node apps/flower-api/src/scripts/migrate-organization-ids.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flower-business';

async function migrateOrganizationIds() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');
    const weeksCollection = db.collection('flower_weeks');
    const organizationsCollection = db.collection('organizations');

    // Create a map of orgId -> _id
    const orgIdMap = new Map<string, string>();
    const organizations = await organizationsCollection.find({}).toArray();
    
    for (const org of organizations) {
      if (org.orgId && org._id) {
        orgIdMap.set(org.orgId, org._id.toString());
        console.log(`Mapped orgId: ${org.orgId} -> ObjectId: ${org._id.toString()}`);
      }
    }

    if (orgIdMap.size === 0) {
      console.log('No organizations found. Skipping migration.');
      return;
    }

    // Migrate users
    console.log('\nMigrating users...');
    let usersUpdated = 0;
    const users = await usersCollection.find({ organizationId: { $exists: true } }).toArray();
    
    for (const user of users) {
      if (typeof user.organizationId === 'string' && user.organizationId.startsWith('org_')) {
        const objectId = orgIdMap.get(user.organizationId);
        if (objectId) {
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { organizationId: new (require('mongodb').ObjectId)(objectId) } }
          );
          usersUpdated++;
          console.log(`Updated user ${user.email}: ${user.organizationId} -> ${objectId}`);
        } else {
          console.warn(`Warning: No ObjectId found for orgId: ${user.organizationId} (user: ${user.email})`);
        }
      }
    }
    console.log(`✓ Updated ${usersUpdated} users`);

    // Migrate weeks
    console.log('\nMigrating weeks...');
    let weeksUpdated = 0;
    const weeks = await weeksCollection.find({ organizationId: { $exists: true } }).toArray();
    
    for (const week of weeks) {
      if (typeof week.organizationId === 'string' && week.organizationId.startsWith('org_')) {
        const objectId = orgIdMap.get(week.organizationId);
        if (objectId) {
          await weeksCollection.updateOne(
            { _id: week._id },
            { $set: { organizationId: new (require('mongodb').ObjectId)(objectId) } }
          );
          weeksUpdated++;
          console.log(`Updated week ${week.weekNumber}/${week.year}: ${week.organizationId} -> ${objectId}`);
        } else {
          console.warn(`Warning: No ObjectId found for orgId: ${week.organizationId} (week: ${week.weekNumber}/${week.year})`);
        }
      }
    }
    console.log(`✓ Updated ${weeksUpdated} weeks`);

    console.log('\n✅ Migration completed successfully!');
    console.log(`   - Users updated: ${usersUpdated}`);
    console.log(`   - Weeks updated: ${weeksUpdated}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration
migrateOrganizationIds()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });

