import {Controller, Param, Post, Get, HttpCode, HttpStatus, Body, ParseIntPipe} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {Public} from "../common/decorators/public.decorator";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() dto: CreateUserDto) {
        await this.userService.createUser(dto);

        return {
            success: true,
            message: 'User signed up successfully',
        }
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.getUserById(id);

        return {
            success: true,
            user,
        }
    }



}