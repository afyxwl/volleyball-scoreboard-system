import Match from '#models/match'
import MatchEvent from '#models/match_event'
import MatchFactory from '#domain/factories/match_factory'
import type { TeamNumber } from '#domain/match/abstract_match'
import BroadcastService from '#services/match/broadcast_service'

export default class MatchService {
  private broadcaster = new BroadcastService()

  public async getMatchOrFail(matchId: number): Promise<Match> {
    return await Match.findOrFail(matchId)
  }

  public async getAllMatches() {
    return await Match.all()
  }

  public async getSerializedMatch(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)
    return domainMatch.serializeForScreen()
  }

  public async addPoint(matchId: number, team: TeamNumber) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.addPoint(team)

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.point_added', { team })

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async removePoint(matchId: number, team: TeamNumber) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.removePoint(team)

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.point_removed', { team })

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async takeTimeout(matchId: number, team: TeamNumber) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.takeTimeout(team)

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.timeout_taken', { team })

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async startPeriod(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.startPeriod()

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.period_started', {})

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async endPeriod(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.endPeriod()

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.period_ended', {})

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async renameTeams(matchId: number, team1Name: string, team2Name: string) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.renameTeam(1, team1Name)
    domainMatch.renameTeam(2, team2Name)

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.teams_renamed', {
      team1Name,
      team2Name,
    })

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async setClockTime(matchId: number, time: string | null) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)

    domainMatch.setClockTime(time)

    await this.persist(matchModel, domainMatch)
    await this.logEvent(matchModel.id, 'match.clock_updated', { time })

    const payload = domainMatch.serializeForScreen()
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  private async persist(matchModel: Match, domainMatch: ReturnType<typeof MatchFactory.fromModel>) {
    const serialized = domainMatch.serializeForScreen()

    matchModel.status = serialized.status
    matchModel.currentSet = serialized.currentSet
    matchModel.isActive = serialized.isActive

    matchModel.team1Name = serialized.team1.name
    matchModel.team2Name = serialized.team2.name

    matchModel.score1 = serialized.team1.score
    matchModel.score2 = serialized.team2.score

    matchModel.timeouts1 = serialized.team1.timeoutsUsed
    matchModel.timeouts2 = serialized.team2.timeoutsUsed

    matchModel.periodTime = serialized.clock.time

    await matchModel.save()
  }

  private async logEvent(
    matchId: number,
    eventType: string,
    payloadJson: Record<string, unknown>
  ) {
    await MatchEvent.create({
      matchId,
      eventType,
      payloadJson,
    })
  }
}