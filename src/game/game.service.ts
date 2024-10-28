import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class GameService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly prismaService: PrismaService) {
    }

    async createGame(userId: string, roomName: string): Promise<any> {
        const gameId = `game:${Date.now()}`;
        const game = {
            id: gameId,
            roomName,
            players: [userId],
            status: 'waiting',
            roles: {},
        };
        await this.cache.set(gameId, JSON.stringify(game));
        return game;
    }

    async joinGame(userId: string, gameId: string): Promise<any> {
        console.log("gameId", gameId);

        const gameStrFromCache = await this.cache.get(`game:${gameId}`);
 
    
        if (!gameStrFromCache) throw new Error('Game not found');

        const gameStr = gameStrFromCache;

        const game = JSON.parse(gameStr as string);
        if (game.status !== 'waiting') throw new Error('Game already started');
        if (game.players.includes(userId)) throw new Error('Player already in game');

        game.players.push(userId);
        await this.cache.set(gameId, JSON.stringify(game));
        return game;
    }

    async startGame(gameId: string): Promise<any> {
        const gameStr = await this.cache.get(`game:${gameId}`);
        if (!gameStr) throw new Error('Game not found');

        const game = JSON.parse(gameStr as string);
        if (game.status !== 'waiting') throw new Error('Game already started');
        if (game.players.length < 4) throw new Error('Not enough players');

        game.status = 'in_progress';
        game.roles = this.assignRoles(game.players);
        await this.cache.set(gameId, JSON.stringify(game));
        return game;
    }

    async closeRoom(gameId: string): Promise<void> {
        await this.cache.del(gameId);
    }

    private assignRoles(players: string[]): Record<string, string> {
        const roles = ['mafia', 'doctor', 'detective', ...Array(players.length - 3).fill('civilian')];
        const shuffled = roles.sort(() => 0.5 - Math.random());
        return Object.fromEntries(players.map((player, index) => [player, shuffled[index]]));
    }
}