import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [CacheModule.register({
        isGlobal: true,
        store: 'memory',
        ttl: 60,
    }),
        UserModule],
    providers: [GameService, GameGateway, UserService, PrismaService],
    exports: [GameService],
})
export class GameModule { }