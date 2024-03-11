/* eslint-disable prettier/prettier */
import { Body, Controller, Post as HTTPPost } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @HTTPPost('create')
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }
}
