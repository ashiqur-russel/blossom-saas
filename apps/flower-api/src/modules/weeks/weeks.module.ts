/**
 * Weeks Module - Feature Module
 * Follows NestJS best practices: Feature-based module organization
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeksController } from './weeks.controller';
import { WeeksService } from './weeks.service';
import { Week, WeekSchema } from './schemas/week.schema';
import { Withdrawal, WithdrawalSchema } from '../withdrawals/schemas/withdrawal.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Week.name, schema: WeekSchema },
      { name: Withdrawal.name, schema: WithdrawalSchema },
    ]),
    AuthModule,
  ],
  controllers: [WeeksController],
  providers: [WeeksService],
  exports: [WeeksService],
})
export class WeeksModule {}
