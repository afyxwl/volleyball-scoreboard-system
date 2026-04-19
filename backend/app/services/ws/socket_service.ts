import type { Server as SocketIOServer, Socket } from 'socket.io'

class SocketService {
  private io: SocketIOServer | null = null

  public initialize(io: SocketIOServer) {
    if (this.io) {
      return
    }

    this.io = io

    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`)

      socket.on('screen:join', (screenId: number | string) => {
        const normalizedScreenId = Number(screenId)
        const room = `screen:${normalizedScreenId}`

        socket.join(room)
        console.log(`Socket ${socket.id} joined ${room}`)
      })

      socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`)
      })
    })
  }

  public emitToScreen(screenId: number, event: string, payload: unknown) {
    if (!this.io) {
      throw new Error('Socket.IO not initialized')
    }

    this.io.to(`screen:${screenId}`).emit(event, payload)
  }
}

const socketService = new SocketService()
export default socketService