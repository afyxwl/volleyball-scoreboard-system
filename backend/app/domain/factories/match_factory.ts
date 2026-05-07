import ClockState from '#domain/clock/clock_state'
import AbstractMatch from '#domain/match/abstract_match'
import BasketballMatch from '#domain/match/basketball_match'
import VolleyballMatch from '#domain/match/volleyball_match'
import TeamState from '#domain/team/team_state'
import Match from '#models/match'

function normalizeSetScores(value: Match['setScoresJson']) {
  if (!value) {
    return { team1: [], team2: [] }
  }

  const parsed = typeof value === 'string' ? JSON.parse(value) : value

  return {
    team1: Array.isArray(parsed?.team1) ? parsed.team1.map(Number) : [],
    team2: Array.isArray(parsed?.team2) ? parsed.team2.map(Number) : [],
  }
}

export default class MatchFactory {
  public static fromModel(match: Match): AbstractMatch {
    const team1 = new TeamState(
      match.team1Name,
      match.score1,
      match.timeouts1,
      match.fouls1 ?? 0
    )

    const team2 = new TeamState(
      match.team2Name,
      match.score2,
      match.timeouts2,
      match.fouls2 ?? 0
    )

    const clock = new ClockState(match.periodTime, match.status === 'live')

    const commonParams = {
      id: match.id,
      screenId: match.screenId,
      sportType: match.sportType,
      status: match.status,
      currentSet: match.currentSet,
      isActive: match.isActive,
      team1,
      team2,
      clock,

      theme: {
        team1Color: match.team1Color ?? '#67e8f9',
        team2Color: match.team2Color ?? '#fda4af',
        fontFamily: match.fontFamily ?? 'system',
        boardStyle: match.boardStyle ?? 'neon',
      },

      setScores: normalizeSetScores(match.setScoresJson),

      shotClock: {
        seconds: match.shotClockSeconds ?? 24,
        isRunning: match.shotClockRunning ?? false,
        defaultSeconds: 24,
      },
    }

    switch (match.sportType) {
      case 'basketball':
        return new BasketballMatch(commonParams)

      case 'volleyball':
      default:
        return new VolleyballMatch(commonParams)
    }
  }
}