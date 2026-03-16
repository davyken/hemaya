import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDocument = HeyamaObject & Document;

@Schema({ timestamps: true })
export class HeyamaObject {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  imageKey: string;
}

export const ObjectSchema = SchemaFactory.createForClass(HeyamaObject);
