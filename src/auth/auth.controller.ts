import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {CurrentUser} from "../common/decorators/current-user.decorator";
import type {AuthUser} from "./interfaces/auth-user.interface";
import type { Request, Response } from 'express';
import {Public} from "../common/decorators/public.decorator";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {LoginDto} from "./dto/login.dto";
import {setRefreshCookies} from "../common/utils/cookies.utils";
import {RefreshTokenGuard} from "./guards/refresh-token.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({passthrough: true}) res: Response) {
        const result = await this.authService.login(dto.email, dto.password);
        setRefreshCookies(res, result.refreshToken);

        return {
            message: "Logged in Successfully",
            accessToken: result.accessToken,
        }
    }


    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: AuthUser){
        await this.authService.logout(user.id);

        return {
            message: "Logged out Successfully",
        }
    }

    @Public()
    @Post('refresh-token')
    @UseGuards(RefreshTokenGuard)
    async refreshToken(
        @Req() req: Request,
        @CurrentUser() user: AuthUser,
        @Res({passthrough: true}) res: Response,
    ){
        const refreshToken = req.cookies.refreshToken;
        const tokens =  await this.authService.refreshToken(
            user.id,
            refreshToken,
        )
        setRefreshCookies(res, tokens.refreshToken);
        return {
            message: "tokens refreshes successfully",
        }
    }
}