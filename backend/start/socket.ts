import socketService from '#services/ws/socket_service'
import { HttpContext } from '@adonisjs/core/http'

export default function registerSocket(server: any) {
  socketService.boot(server)

  console.log('WebSocket initialized')
}