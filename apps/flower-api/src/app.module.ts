import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeksModule } from './modules/weeks/weeks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:28018/flower-business',
    ),
    WeeksModule,
  ],
})
export class AppModule {}

