import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {compare, hash} from "../common/utils/hash.utils";
import {AuthTokens} from "./interfaces/token.interface";
import {AuthUser} from "./interfaces/auth-user.interface";
import {AuthResponse} from "./interfaces/auth-response.interface";
import {ValidatedUser} from "./interfaces/validated-user.interface";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}


    async generateTokens(userId: number, email: string):Promise<AuthTokens> {
        const payload = {
            sub: String(userId),
            email,
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
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException("Invalid Credentials");

        const isMatch = await compare(password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException("Invalid Credentials");

        const { passwordHash, ...safeUser } = user;

        return {
            id: user.id,
            email: user.email,
        }

    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.validateUser(email, password);
        if (!user) throw new UnauthorizedException("Invalid Credentials");

        const tokens = await this.generateTokens(user.id, user.email);

        await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user,
            accessToken: tokens.accessToken,
        }
    }

    async refreshToken(userId: number, refreshToken: string):Promise<AuthTokens> {
        const user = await this.userService.findById(userId);

        if (!user || !user.refreshTokenHash) throw new UnauthorizedException("Invalid Credentials");

        const isValid = await compare(refreshToken, user.refreshTokenHash);
        if (!isValid) throw new UnauthorizedException("Invalid Credentials");

        //Rotation
        const tokens:AuthTokens = await this.generateTokens(user.id, user.email);

        await this.userService.updateRefreshToken(user.id, refreshToken);
        return tokens;
    }


    async logout(userId: number):Promise<void> {
        await this.userService.removeRefreshToken(userId);
    }







}
