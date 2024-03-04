import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Image, ImageDocument } from './schemas/image.schema';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  private readonly visionApiUrl =
    'https://vision.googleapis.com/v1/images:annotate';
  private readonly apiKey = 'AIzaSyB9OToqO7VcdFBNctX-5znl1lkWC9mAhYE';

  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async analyzeAndSaveImage(createImageDto: CreateImageDto): Promise<{
    success: boolean;
    message: string;
    data?: any;
    savedToDb?: boolean;
    errorDetails?: any;
  }> {
    const imageUri = createImageDto.imageUrl;

    try {
      const analysisResults = await this.analyzeImageForSafeContent(imageUri);
      const isExplicitContent = ['adult'].some((category) =>
        ['LIKELY', 'VERY_LIKELY'].includes(analysisResults[category]),
      );

      // ! BU NOKTADA LIKELY=%80+ DERSEK BURAYA ÖZEL OLARAK BLURLAMA VEREBİLİRİZ
      // ! %80 ÇIPLAKLIK OLAN İÇERİK REDDIT VEYA BENZER BLOGLARDAKİ GİBİ BLURLU GÖSTERİLEBİLİR
      // ! %100 OLAN RESİMLERİ YİNE BANLARIZ

      if (!isExplicitContent) {
        const createdImage = await new this.imageModel({
          imageUrl: imageUri,
          analysisResults,
        }).save();

        return {
          success: true,
          message: 'Image and analysis results successfully saved to MongoDB.',
          data: createdImage,
          savedToDb: true,
        };
      } else {
        return {
          success: false,
          message: 'Image contains explicit content and was not saved.',
          data: { imageUrl: imageUri, analysisResults },
          savedToDb: false,
        };
      }
    } catch (error) {
      console.error('Error processing request:', {
        errorMessage: error.message || error.toString(),
        errorStack: error.stack,
      });
      throw new HttpException(
        'Failed to process the image analysis request. ' +
          (error.message || error.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async analyzeImageForSafeContent(imageUri: string): Promise<any> {
    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri,
            },
          },
          features: [{ type: 'SAFE_SEARCH_DETECTION' }],
        },
      ],
    };

    try {
      const response = await axios.post(
        `${this.visionApiUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.data.responses[0].error) {
        console.error(
          'Google Vision API error:',
          response.data.responses[0].error,
        );
        throw new Error(
          `Google Vision API error: ${response.data.responses[0].error.message}, Code: ${response.data.responses[0].error.code}`,
        );
      }

      return response.data.responses[0].safeSearchAnnotation;
    } catch (error) {
      console.error('Error sending request to Google Vision API:', {
        errorMessage: error.message || error.toString(),
        errorDetails: error.response ? error.response.data : null,
      });
      throw new HttpException(
        'Failed to analyze the image with Google Vision API. ' +
          (error.message || error.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
