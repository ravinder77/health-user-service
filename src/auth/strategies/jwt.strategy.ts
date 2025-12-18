import {PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {JwtPayload} from  "../interfaces/jwt-payload.interface"
import {Injectable} from "@nestjs/common";
import {AuthUser} from "../interfaces/auth-user.interface";

@Injectable()
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
            id: payload.sub,
            email: payload.email,
        }
    }
}