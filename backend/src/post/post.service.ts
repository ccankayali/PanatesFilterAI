/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

    async create(createPostDto: CreatePostDto): Promise<Post> {
        const newId = await this.getNextUniqueId();
        const createdPost = new this.postModel({
            ...createPostDto,
            id: newId,
        });
        return createdPost.save();
    }

    private async getNextUniqueId(): Promise<number> {
        const lastPost = await this.postModel.findOne().sort({ id: -1 }).exec();
        return lastPost && lastPost.id ? lastPost.id + 1 : 1;
    }

    async findAll(): Promise<Post[]> {
        return this.postModel.find().exec();
    }

    async update(id: number, updatePostDto: CreatePostDto): Promise<Post> {
        const updatedPost = await this.postModel.findOneAndUpdate({ id }, updatePostDto, { new: true }).exec();
        if (!updatedPost) {
            throw new NotFoundException(`Post with ID "${id}" not found.`);
        }
        return updatedPost;
    }

    async delete(id: number): Promise<Post> {
        const deletedPost = await this.postModel.findOneAndDelete({ id }).exec();
        if (!deletedPost) {
            throw new NotFoundException(`Post with ID "${id}" not found.`);
        }
        return deletedPost;
    }
}
