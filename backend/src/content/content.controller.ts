/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CheckContentDto } from './dto/check-content.dto';

@Controller('content-check')
export class ContentController {
  constructor(private contentCheckService: ContentService) {}

  @Post()
  async check(@Body() dto: CheckContentDto) {
  const isContentValid = await this.contentCheckService.checkContent(dto);
  if(isContentValid){
    throw new HttpException('Content is not valid', HttpStatus.BAD_REQUEST);
  }
  return { message: 'Content is valid'};
  }
}
