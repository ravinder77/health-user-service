import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entities/user.entity";
import {comparePassword} from "../common/utils/hash.utils";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}


    async generateTokens(userId: number, email: string) {
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

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException("Invalid Credentials");

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException("Invalid Credentials");

        const { passwordHash, ...safeUser } = user;

        return safeUser;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) throw new UnauthorizedException("Invalid Credentials");

        const tokens = await this.generateTokens(user.id, user.email);
        return tokens;
    }




}
