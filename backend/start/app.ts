import socketService from '#services/ws/socket_service'

export default {
  async ready(app: any) {
    const server = app.container.use('Adonis/Core/Server').getHttpServer()

    socketService.boot(server)

    console.log('Socket.IO booted from app.ts')
  },
}