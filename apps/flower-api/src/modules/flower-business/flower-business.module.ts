import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowerBusinessController } from './flower-business.controller';
import { FlowerBusinessService } from './flower-business.service';
import { FlowerWeek, FlowerWeekSchema } from './schema/flower-week.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlowerWeek.name, schema: FlowerWeekSchema },
    ]),
  ],
  controllers: [FlowerBusinessController],
  providers: [FlowerBusinessService],
  exports: [FlowerBusinessService],
})
export class FlowerBusinessModule {}

