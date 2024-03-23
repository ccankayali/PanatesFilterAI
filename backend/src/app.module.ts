/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { GptModule } from './gpt/gpt.module';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'),
    PostModule,
    AuthModule,
    ImageModule,
    GptModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}