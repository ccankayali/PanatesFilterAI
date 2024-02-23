/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
    export class PostService {
        constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
    
    async create(createPostDto: CreatePostDto): Promise<Post> {
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
    }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async update(id: string, updatePostDto: CreatePostDto): Promise<Post> {
        return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Post> {
        return this.postModel.findByIdAndDelete(id).exec();
    }

}