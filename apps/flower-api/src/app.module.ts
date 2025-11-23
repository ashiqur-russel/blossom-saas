import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowerBusinessModule } from './modules/flower-business/flower-business.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:28018/flower-business',
    ),
    FlowerBusinessModule,
  ],
})
export class AppModule {}

