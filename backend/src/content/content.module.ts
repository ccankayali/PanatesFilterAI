/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import {ContentController} from './content.controller';
import {ContentService} from './content.service';
import {AiModule} from '../ai/ai.module';

@Module({

    imports: [AiModule],
    controllers: [ContentController],
    providers: [ContentService],
})

export class ContentModule {}