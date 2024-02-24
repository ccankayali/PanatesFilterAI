/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Post('create')
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }

    @Get('search')
    async findAll() {
        return this.postService.findAll();
    }
    
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
        const postId = Number(id);
        return this.postService.update(postId, updatePostDto);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        const postId = Number(id);
        return this.postService.delete(postId);
    }
}
