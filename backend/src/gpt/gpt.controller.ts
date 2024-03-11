import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { CreateGptDto } from './dto/create-gpt.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('scan')
  async scan(@Body() createGptDto: CreateGptDto) {
    return this.gptService.scan(createGptDto);
  }
}
