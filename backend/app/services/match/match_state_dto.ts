import Match from '#models/match'

export type MatchStateDto = {
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

export function toMatchStateDto(match: Match): MatchStateDto {
  return {
    id: match.id,
    screenId: match.screenId,
    sportType: match.sportType,
    status: match.status,
    currentSet: match.currentSet,
    isActive: match.isActive,
    clock: {
      time: match.periodTime ?? '00:00',
      isRunning: false,
    },
    team1: {
      name: match.team1Name,
      score: match.score1,
      timeoutsUsed: match.timeouts1,
    },
    team2: {
      name: match.team2Name,
      score: match.score2,
      timeoutsUsed: match.timeouts2,
    },
  }
}