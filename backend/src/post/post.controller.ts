/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post as HTTPPost, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @HTTPPost('create')
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }

    @Get()
    async findAll() {
        return this.postService.findAll();
    }
    
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(id, updatePostDto);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return this.postService.remove(id);
    }
}
