import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway()
export class GameGateway {
    @WebSocketServer() server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly userService: UserService
    ) { }

    @SubscribeMessage('getUsers')
    async handleGetUsers() {
        const users = await this.userService.getUsers();
        return { event: 'users', data: users };
    }

    @SubscribeMessage('createGame')
    async handleCreateGame(@MessageBody() data: { userId: string, roomName: string }, @ConnectedSocket() client: Socket) {
        const game = await this.gameService.createGame(data.userId, data.roomName);
        client.join(game.id);
        return { event: "gameCreated", data: { success: true, gameId: game.id } };
    }

    @SubscribeMessage('joinGame')
    async handleJoinGame(@MessageBody() data: { userId: string, gameId: string }, @ConnectedSocket() client: Socket) {
        const joinedGame = await this.gameService.joinGame(data.userId, data.gameId);
        client.join(data.gameId);
        this.server.to(data.gameId).emit('playerJoined', { userId: data.userId });
        return { event: 'playerJoined', data: { success: true, game: joinedGame } };
    }

    @SubscribeMessage('startGame')
    async handleStartGame(@MessageBody() data: { gameId: string }, @ConnectedSocket() client: Socket) {
        const startedGame = await this.gameService.startGame(data.gameId);
        this.server.to(data.gameId).emit('gameStarted', startedGame);
        return { event: 'gameStarted', data: { success: true } };
    }

    @SubscribeMessage('closeRoom')
    async handleCloseRoom(@MessageBody() data: { gameId: string }, @ConnectedSocket() client: Socket) {
        await this.gameService.closeRoom(data.gameId);
        this.server.to(data.gameId).emit('roomClosed');
        return {
            event: 'roomClosed', data: { success: true }
        };
    }
}