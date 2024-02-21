import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';

/* eslint-disable prettier/prettier */
@Controller('content-check')
export class ContentController {
  constructor(private contentCheckService: ContentService) {}

  @Post()
  async check(@Body('content') content: string) {
    const isContentValid = await this.contentCheckService.checkContent(content);
    if (!isContentValid) {
      throw new HttpException('Content is not valid', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Content is valid' };
  }
}
