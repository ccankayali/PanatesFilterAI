/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './usersService';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const user = await this.usersService.create(signupDto.email, signupDto.password);
        return {
            message: "User created successfully",
            userId: user.id,
            email: user.email
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            return { message: 'User not found or password does not match.' };
        }
        return this.authService.login(user);
    }
}