import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './sockets/socket.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    SocketModule, GameModule, AuthModule, UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
