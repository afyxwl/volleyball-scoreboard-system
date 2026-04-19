import socketService from '#services/ws/socket_service'

type MatchUpdatedPayload = {
  id: number
  screenId: number
  sportType: string
  status: string
  currentSet: number
  isActive: boolean
  clock: {
    time: string | null
    isRunning: boolean
  }
  team1: {
    name: string
    score: number
    timeoutsUsed: number
  }
  team2: {
    name: string
    score: number
    timeoutsUsed: number
  }
}

export default class BroadcastService {
  public async broadcastMatchUpdated(screenId: number, payload: MatchUpdatedPayload) {
    socketService.emitToScreen(screenId, 'match:updated', payload)

    console.log('WS EVENT -> match:updated', {
      room: `screen:${screenId}`,
      event: 'match:updated',
      payload,
    })
  }
}