/**
 * Migration script to fix week indexes
 * Drops old index that doesn't include userId and ensures correct unique index exists
 * 
 * Run with: npx ts-node -r tsconfig-paths/register src/scripts/fix-week-indexes.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:28018/flower-business';

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('flower_weeks');

    console.log('\nCurrent indexes:');
    const indexes = await collection.indexes();
    indexes.forEach((index: any) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop old index if it exists
    try {
      await collection.dropIndex('weekNumber_1_year_1');
      console.log('\n✅ Dropped old index: weekNumber_1_year_1');
    } catch (error: any) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('\nℹ️  Old index weekNumber_1_year_1 does not exist (already removed)');
      } else {
        throw error;
      }
    }

    // Ensure the correct unique index exists
    try {
      await collection.createIndex(
        { userId: 1, weekNumber: 1, year: 1 },
        { unique: true, name: 'userId_1_weekNumber_1_year_1' }
      );
      console.log('✅ Created/verified unique index: userId_1_weekNumber_1_year_1');
    } catch (error: any) {
      if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Unique index userId_1_weekNumber_1_year_1 already exists');
      } else {
        throw error;
      }
    }

    // Create other indexes
    try {
      await collection.createIndex(
        { userId: 1, year: 1, weekNumber: -1 },
        { name: 'userId_1_year_1_weekNumber_-1' }
      );
      console.log('✅ Created/verified index: userId_1_year_1_weekNumber_-1');
    } catch (error: any) {
      if (error.code === 85) {
        console.log('ℹ️  Index userId_1_year_1_weekNumber_-1 already exists');
      } else {
        throw error;
      }
    }

    try {
      await collection.createIndex(
        { userId: 1 },
        { name: 'userId_1' }
      );
      console.log('✅ Created/verified index: userId_1');
    } catch (error: any) {
      if (error.code === 85) {
        console.log('ℹ️  Index userId_1 already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Index migration completed successfully!');
    console.log('\nFinal indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach((index: any) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixIndexes();

