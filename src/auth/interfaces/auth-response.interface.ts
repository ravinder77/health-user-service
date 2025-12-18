import {AuthUser} from "./auth-user.interface";
import {AuthTokens} from "./token.interface";

export interface AuthResponse {
    user: AuthUser,
    tokens: AuthTokens
}