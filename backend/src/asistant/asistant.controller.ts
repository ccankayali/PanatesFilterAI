/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AsistantService } from './asistant.service';
import { CreateAsistantDto } from './dto/create-asistant.dto';

@Controller('asistant')
export class AsistantController {
  constructor(private readonly asistantService: AsistantService) {}

  @Post('scan')
  async scan(@Body() createAsistantDto: CreateAsistantDto) {
    // Calling the correct method from AsistantService
    const result = await this.asistantService.createThreadAndSendMessage(createAsistantDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
