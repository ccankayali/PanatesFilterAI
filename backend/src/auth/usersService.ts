/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, password: string): Promise<User> {
    // Benzersiz bir ID üretme. Burada basit bir örnek var, daha karmaşık bir mantık kullanabilirsiniz.
    const newId = await this.getNextUniqueId();

    const newUser = new this.userModel({
      id: newId,
      email,
      password,
    });

    await newUser.save();
    return newUser;
  }

  private async getNextUniqueId(): Promise<number> {
    const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
    return lastUser && lastUser.id ? lastUser.id + 1 : 1;
  }

    async findOne(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
    return user;
  }
}
