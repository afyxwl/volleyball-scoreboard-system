import type { ApplicationService } from '@adonisjs/core/types'
import type { Server as HttpServer } from 'node:http'
import type { Server as HttpsServer } from 'node:https'
import { bootstrapSocket } from '#start/socket'

type AdonisHttpServer = {
  getNodeServer(): HttpServer | HttpsServer | undefined
}

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    if (this.app.getEnvironment() !== 'web') {
      return
    }

    const server = (await this.app.container.make('server')) as AdonisHttpServer
    const nodeServer = server.getNodeServer()

    if (!nodeServer) {
      throw new Error('Node HTTP server is not available for Socket.IO bootstrap')
    }

    bootstrapSocket(nodeServer)
  }
}