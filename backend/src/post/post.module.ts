/* eslint-disable prettier/prettier */
// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), HttpModule,],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}