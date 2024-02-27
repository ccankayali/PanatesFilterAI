/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    readonly content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
