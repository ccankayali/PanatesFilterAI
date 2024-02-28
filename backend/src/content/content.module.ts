/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { image, ImageSchema } from './entities/content.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: image.name, schema: ImageSchema }])
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
