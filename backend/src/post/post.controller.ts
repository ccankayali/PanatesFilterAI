/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Post()
    async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
    }

    @Get()
    async findAll() {
    return this.postService.findAll();
    }
    
    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
        return this.postService.update(id, updatePostDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.postService.delete(id);
    }
}