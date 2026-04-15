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
    /**
     * Тимчасово: просто лог у консоль.
     * На наступному запуску з реальним WS тут буде emit у кімнату screen:{id}
     */
    console.log('WS EVENT -> match:updated', {
      room: `screen:${screenId}`,
      event: 'match:updated',
      payload,
    })
  }
}