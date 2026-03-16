import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { HeyamaObject, ObjectSchema } from './object.schema';
import { StorageModule } from '../storage/storage.module';
import { EventsGateway } from '../gateway/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HeyamaObject.name, schema: ObjectSchema }]),
    StorageModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, EventsGateway],
})
export class ObjectsModule {}
