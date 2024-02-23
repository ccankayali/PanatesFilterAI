/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, userDocument } from "./entities/user.entity";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>) {}

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }
}