import {AuthUser} from "./auth-user.interface";

export interface AuthResponse {
    user: AuthUser,
    accessToken: string;
}