import {AuthUser} from "./auth-user.interface";
import {AuthTokens} from "./token.interface";

export interface AuthResponse {
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
}