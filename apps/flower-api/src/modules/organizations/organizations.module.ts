import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { OrganizationIdService } from './services/organization-id.service';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationIdService, OrganizationsService],
  exports: [OrganizationIdService, OrganizationsService, MongooseModule],
})
export class OrganizationsModule {}

