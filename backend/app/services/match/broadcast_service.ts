import socketService from '#services/ws/socket_service'

export default class BroadcastService {
  public async broadcastMatchUpdated(screenId: number, payload: any) {
    socketService.emitToScreen(screenId, 'match:updated', payload)
  }
}