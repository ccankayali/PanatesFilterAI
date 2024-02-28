/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { image, ImageDocument } from './entities/content.entity';

export interface SafeSearchResponse {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

@Injectable()
export class ContentService {
  private readonly visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate';
  private readonly apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

  constructor(@InjectModel(image.name) private imageModel: Model<ImageDocument>) {}

  async analyzeAndSaveImage(imageUri: string): Promise<{ success: boolean; message: string; data?: any }> {
    let analysisResults: SafeSearchResponse;
    try {
      analysisResults = await this.analyzeImageForSafeContent(imageUri);
    } catch (error) {
      console.error('Error analyzing image with Google Vision API:', error);
      throw new HttpException('Error analyzing image with Google Vision API', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const isExplicitContent = ['adult', 'racy'].some(category => 
      ['LIKELY', 'VERY_LIKELY'].includes(analysisResults[category])
    );

    if (!isExplicitContent) {
      try {
        const createdImage = await this.imageModel.create({ imageUrl: imageUri, analysisResults });
        return { success: true, message: 'Görsel ve analiz sonuçları başarıyla kaydedildi.', data: createdImage };
      } catch (error) {
        console.error('Error saving image to MongoDB:', error);
        throw new HttpException('Error saving image to MongoDB', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      return { success: false, message: 'Görsel cinsel içerik barındırıyor ve kaydedilmedi.' };
    }
  }

  async analyzeImageForSafeContent(imageUri: string): Promise<SafeSearchResponse> {
    const requestBody = {
      requests: [
        {
          image: { source: { imageUri } },
          features: [{ type: 'SAFE_SEARCH_DETECTION' }],
        },
      ],
    };

    const response = await axios.post(`${this.visionApiUrl}?key=${this.apiKey}`, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data.responses[0].error) {
      throw new Error(response.data.responses[0].error.message);
    }

    const safeSearch = response.data.responses[0].safeSearchAnnotation;
    return safeSearch;
  }
}
