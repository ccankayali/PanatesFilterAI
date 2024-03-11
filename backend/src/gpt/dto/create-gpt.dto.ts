import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGptDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
