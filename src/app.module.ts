import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UserModule} from "./user/user.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import databaseConfig from "./config/database.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [databaseConfig]
      }),
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
              const db = configService.get('database');
              return {
                  type: db.type,
                  host: db.host,
                  port: db.port,
                  username: db.username,
                  password: db.password,
                  database: db.name,
                  autoLoadEntities: db.autoload,
                  synchronize: db.synchronize,
                  logging: db.logging,
              }
          }

      }),
      UserModule,

  ],
  controllers: [AppController],
  providers: [
      {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
      },
      AppService
  ],
})
export class AppModule {}
