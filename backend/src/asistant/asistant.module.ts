/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AsistantService } from './asistant.service';
import { AsistantController } from './asistant.controller';
import { Asistant, AsistantSchema } from './entities/asistant.entity';

@Module({
  imports: [
    HttpModule, // Import HttpModule here
    MongooseModule.forFeature([{ name: Asistant.name, schema: AsistantSchema }])
  ],
  providers: [AsistantService],
  controllers: [AsistantController],
})
export class AsistantModule {}
