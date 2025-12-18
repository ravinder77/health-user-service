import {Response } from 'express';

export const setRefreshCookies = (res: Response, refreshToken: string) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    })
}

export const clearAuthCookies = (res: Response) => {
    res.clearCookie('refresh_token', {
        path: 'auth/refresh-token',
    });
}