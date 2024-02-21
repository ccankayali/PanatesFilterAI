/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content-check')
export class ContentController {
  constructor(private contentCheckService: ContentService) {}

  @Post()
  async check(@Body('content') content: string) {
    const contentDto = { content };
    const isContentValid = await this.contentCheckService.checkContent(contentDto); // contentDto'yu argüman olarak kullan
    if (!isContentValid) {
      throw new HttpException('Content is not valid', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Content is valid' };
  }
}
