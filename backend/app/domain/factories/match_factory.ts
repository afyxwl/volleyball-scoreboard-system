import ClockState from '#domain/clock/clock_state'
import AbstractMatch from '#domain/match/abstract_match'
import VolleyballMatch from '#domain/match/volleyball_match'
import TeamState from '#domain/team/team_state'
import Match from '#models/match'

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

    switch (match.sportType) {
      case 'volleyball':
      default:
        return new VolleyballMatch({
          id: match.id,
          screenId: match.screenId,
          sportType: match.sportType,
          status: match.status,
          currentSet: match.currentSet,
          isActive: match.isActive,
          team1,
          team2,
          clock,
        })
    }
  }
}