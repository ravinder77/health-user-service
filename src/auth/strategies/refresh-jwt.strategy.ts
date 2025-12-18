import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import type {Request, Response} from "express";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.refreshToken,
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET!
        })
    }

    async validate(payload: JwtPayload) {
        return {
            id: payload.sub,
            email: payload.email,
        }
    }
}
