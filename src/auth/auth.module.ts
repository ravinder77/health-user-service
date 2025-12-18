import {forwardRef, Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const jwt = config.get('jwt');
                if(!jwt.secret) throw new Error("Jwt secret is missing");
                return {
                    secret: jwt.secret,
                    signOptions: {
                        audience: jwt.audience,
                        issuer: jwt.issuer,
                        expiresIn: `${jwt.accessTokenTTL}s`
                    }
                }
            }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
    ],
    exports: [
        AuthService,
    ]
})
export class AuthModule {}