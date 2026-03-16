import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeyamaObject, ObjectDocument } from './object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { StorageService } from '../storage/storage.service';
import { EventsGateway } from '../gateway/events.gateway';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(HeyamaObject.name) private objectModel: Model<ObjectDocument>,
    private storageService: StorageService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(dto: CreateObjectDto, file: Express.Multer.File): Promise<ObjectDocument> {
    const { url, key } = await this.storageService.uploadFile(file);

    const obj = new this.objectModel({
      title: dto.title,
      description: dto.description,
      imageUrl: url,
      imageKey: key,
    });

    const saved = await obj.save();
    this.eventsGateway.emitNewObject(saved.toJSON());
    return saved;
  }

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Object #${id} not found`);
    return obj;
  }

  async remove(id: string): Promise<{ message: string }> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Object #${id} not found`);

    if (obj.imageKey) {
      await this.storageService.deleteFile(obj.imageKey);
    }

    await this.objectModel.findByIdAndDelete(id).exec();
    this.eventsGateway.emitDeleteObject(id);
    return { message: 'Object deleted successfully' };
  }
}
