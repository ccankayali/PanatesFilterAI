/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { getModelToken } from '@nestjs/mongoose';
import { Image } from './schemas/image.schema';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ImageService', () => {
    let service: ImageService;
    let mockImageModel;

    beforeEach(async() => {
        mockImageModel = {
            new: jest.fn().mockReturnThis(),
            save: jest.fn().mockResolvedValue({}),
    };
    
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            ImageService,
        {
            provide: getModelToken(Image.name),
            useValue: mockImageModel,
        },
    ],
    }).compile();
    service = module.get<ImageService>(ImageService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save the image if it does not contain explicit content', async () => {
    mockedAxios.post.mockResolvedValue({
        data: {
        responses: [
            {
            safeSearchAnnotation: {
                adult: 'UNLIKELY',
            },
            },
        ],
        },
    });

    const createImageDto = { imageUrl: 'http://example.com/image.jpg' };
    const result = await service.analyzeAndSaveImage(createImageDto);

    expect(result.success).toBeTruthy();
    expect(mockImageModel.save).toHaveBeenCalled();
    });

});