/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GptService } from './gpt.service';
import { getModelToken } from '@nestjs/mongoose';
import { Gpt } from './schemas/gpt.schemas';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GptService', () => {
  let service: GptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GptService,
        {
          provide: getModelToken(Gpt.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GptService>(GptService);
  });

    it('should return success true with results on successful moderation', async() => {
        const testContent = 'This is a test content';
        mockedAxios.post.mockResolvedValue({
            data: { moderated: false },
        });
    
        const result = await service.scan({ content: testContent });
        expect(result.success).toBeTruthy();
        expect(result.results).toEqual({ moderated: false });
    });

    it('should return success false with error message on failed moderation', async () => {
        const testContent = 'This is a test content that fails.';
        mockedAxios.post.mockRejectedValue(new Error('Moderation failed'));

        const result = await service.scan({ content: testContent });
        expect(result.success).toBeFalsy();
        expect(result.results).toContain('Moderation failed');
    });

});