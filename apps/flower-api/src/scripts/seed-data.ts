import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FlowerBusinessService } from '../modules/flower-business/flower-business.service';
import { getModelToken } from '@nestjs/mongoose';
import { FlowerWeek } from '../modules/flower-business/schema/flower-week.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const flowerWeekModel = app.get(getModelToken(FlowerWeek.name));

  // Get current week
  const today = new Date();
  const year = today.getFullYear();
  const weekNumber = getWeekNumber(today);
  
  // Calculate start and end of current week
  const startDate = getStartOfWeek(today);
  const endDate = getEndOfWeek(today);

  // Check if week already exists
  const existing = await flowerWeekModel.findOne({ weekNumber, year });
  if (existing) {
    console.log(`Week ${weekNumber} of ${year} already exists. Skipping seed.`);
    await app.close();
    return;
  }

  // Create initial week with provided data
  const initialWeek = {
    weekNumber,
    year,
    startDate,
    endDate,
    quantity: 280, // menge flower
    price: 220, // flower price
    profit: 318,
    savings: 200,
    nextWeekBudget: 300, // for next week flower buy
  };

  await flowerWeekModel.create(initialWeek);
  console.log(`Successfully seeded week ${weekNumber} of ${year} with initial data.`);
  console.log('Data:', initialWeek);

  await app.close();
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

bootstrap().catch((error) => {
  console.error('Error seeding data:', error);
  process.exit(1);
});

