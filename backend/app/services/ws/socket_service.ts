import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'

class SocketService {
  private io: Server | null = null

  public boot(httpServer: HttpServer) {
    if (this.io) {
      return this.io
    }

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
        console.log(`socket ${socket.id} joined ${room}`)
      })

      socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id)
      })
    })

    return this.io
  }

  public getInstance() {
    if (!this.io) {
      throw new Error('Socket.IO server has not been initialized')
    }

    return this.io
  }

  public emitToScreen(screenId: number, event: string, payload: unknown) {
    const io = this.getInstance()
    io.to(`screen:${screenId}`).emit(event, payload)
  }
}

const socketService = new SocketService()
export default socketService