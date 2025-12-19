import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {compare, hash} from "../common/utils/hash.utils";
import {AuthTokens} from "./interfaces/token.interface";
import {AuthResponse} from "./interfaces/auth-response.interface";
import {ValidatedUser} from "./interfaces/validated-user.interface";
import {User} from "../user/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async generateTokens(userId: number, email: string):Promise<AuthTokens> {
        const payload = {
            sub: userId.toString(),
            email: email,
        }

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
            secret: process.env.JWT_ACCESS_SECRET,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET,
        })
        return {
            accessToken,
            refreshToken,
        }
    }

    async validateUser(email: string, password: string):Promise<ValidatedUser> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException("Invalid Credentials");

        const isMatch = await compare(password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException("Invalid Credentials");

        return {
            id: user.id,
            email: user.email,
        }

    }


    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.validateUser(email, password);

        const tokens = await this.generateTokens(user.id, user.email);

        //Hash refresh token
        const refreshTokenHash = await hash(tokens.refreshToken);

        // Store hashed refresh token
        await this.userService.updateRefreshToken(user.id, refreshTokenHash);

        return {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    }

    async refreshToken(userId: number, refreshToken: string):Promise<AuthTokens> {
        const user = await this.userService.getUserById(userId);

        if (!user || !user.refreshTokenHash) throw new UnauthorizedException("Invalid Credentials");

        const isValid = await compare(refreshToken, user.refreshTokenHash);
        if (!isValid) throw new UnauthorizedException("Invalid Credentials");

        // Generate new tokens: Rotation
        const tokens:AuthTokens = await this.generateTokens(user.id, user.email);

        // Hash new refresh token
        const newRefreshTokenHash = await hash(tokens.refreshToken);

        // update the refresh token
        await this.userService.updateRefreshToken(user.id, newRefreshTokenHash);
        return tokens;
    }


    async logout(userId: number):Promise<void> {
        await this.userService.removeRefreshToken(userId);
    }

}
