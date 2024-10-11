import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, roomName: string) {
        client.join(roomName);
        client.emit('joinedRoom', roomName);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, roomName: string) {
        client.leave(roomName);
        client.emit('leftRoom', roomName);
    }
}