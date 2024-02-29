/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ContentService, SafeSearchResponse } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('analyze')
  async analyzeImage(@Body('imageUri') imageUri: string): Promise<{ success: boolean; data: SafeSearchResponse }> {    try {
      const analysisResult = await this.contentService.analyzeImageForSafeContent(imageUri);
      return { success: true, data: analysisResult };
    } catch (error) {
      throw new HttpException(`İşlem sırasında bir hata oluştu: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}