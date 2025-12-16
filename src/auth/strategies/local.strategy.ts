import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";
import {UnauthorizedException} from "@nestjs/common";

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({usernameField: 'email'}); // tells passport to use email field instead of username
    }

    async validate(email: string, password: string) {
        const user = this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Invalid Credentials");
        }
        return user; // attaches user to req.user
    }


}