/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from './usersService';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password === pass) {
            return { email: user.email, id: user.id };
        }
        return null;
    }

    async login(user: any) {
        return {
            message: "Login successful",
            email: user.email,
            id: user.id
        };
    }
}
