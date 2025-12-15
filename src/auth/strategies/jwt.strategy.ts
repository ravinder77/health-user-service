import {PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {JwtPayload} from  "../interfaces/jwt-payload.interface"

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET!,
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload ){
        return {
            userId: payload.sub,
            email: payload.email,
        }
    }
}