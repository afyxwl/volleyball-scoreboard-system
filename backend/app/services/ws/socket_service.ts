import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'

class SocketService {
  private io: Server | null = null

  public boot(httpServer: HttpServer) {
    if (this.io) return this.io

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    })

    this.io.on('connection', (socket) => {
      console.log('socket connected', socket.id)

      socket.on('screen:join', (payload: { screenId: number }) => {
        const room = `screen:${payload.screenId}`
        socket.join(room)
      })

      socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id)
      })
    })

    return this.io
  }

  public getInstance() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized')
    }
    return this.io
  }

  public emitToScreen(screenId: number, event: string, payload: unknown) {
    this.getInstance().to(`screen:${screenId}`).emit(event, payload)
  }
}

export default new SocketService()