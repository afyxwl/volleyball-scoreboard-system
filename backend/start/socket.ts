import { Server as HttpServer } from 'node:http'
import { Server as HttpsServer } from 'node:https'
import { Server as SocketIOServer } from 'socket.io'
import socketService from '#services/ws/socket_service'

let ioInstance: SocketIOServer | null = null

export function bootstrapSocket(httpServer: HttpServer | HttpsServer) {
  if (ioInstance) {
    return ioInstance
  }

  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  })

  socketService.initialize(ioInstance)

  console.log('Socket.IO initialized')

  return ioInstance
}