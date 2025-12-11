import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'meet123',
    name: process.env.DB_NAME || 'fitness-user-service',
    synchronize: process.env.DB_SYNC === 'true',
    autoload: process.env.DB_AUTOLOAD === 'true',
    logging: process.env.DB_LOGGING === 'true',
}));


export type DatabaseConfig = ReturnType<typeof import('./database.config').default>;