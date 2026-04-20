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

  public async getById(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)
    const domainMatch = MatchFactory.fromModel(matchModel)
    return domainMatch.serializeForScreen()
  }

  public async getCurrentByScreenId(screenId: number) {
    const matchModel = await Match.query()
      .where('screen_id', screenId)
      .where('is_active', true)
      .orderBy('id', 'desc')
      .first()

    if (!matchModel) {
      return null
    }
  

    const domainMatch = MatchFactory.fromModel(matchModel)
    return domainMatch.serializeForScreen()
  }
  public async createMatch(payload: {
  screenId: number
  sportType?: string
  team1Name?: string
  team2Name?: string
  currentSet?: number
  periodTime?: string | null
}) {
  await Match.query()
    .where('screen_id', payload.screenId)
    .where('is_active', true)
    .update({ is_active: false })

  const matchModel = await Match.create({
    screenId: payload.screenId,
    sportType: payload.sportType ?? 'volleyball',
    status: 'draft',
    team1Name: payload.team1Name ?? 'TEAM A',
    team2Name: payload.team2Name ?? 'TEAM B',
    score1: 0,
    score2: 0,
    currentSet: payload.currentSet ?? 1,
    timeouts1: 0,
    timeouts2: 0,
    periodTime: payload.periodTime ?? '00:00',
    isActive: true,
  })

  const payloadForScreen = MatchFactory.fromModel(matchModel).serializeForScreen()

  await this.logEvent(matchModel.id, 'match.created', payloadForScreen)
  await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payloadForScreen)

  return payloadForScreen
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

  public async updateScore(matchId: number, team: TeamNumber, delta: number) {
    if (delta > 0) {
      return await this.addPoint(matchId, team)
    }

    if (delta < 0) {
      return await this.removePoint(matchId, team)
    }

    return await this.getById(matchId)
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
    public async getHistory(matchId: number) {
    return await MatchEvent.query()
      .where('match_id', matchId)
      .orderBy('id', 'asc')
  }
    public async resetMatch(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)

    matchModel.status = 'draft'
    matchModel.currentSet = 1
    matchModel.team1Name = 'TEAM A'
    matchModel.team2Name = 'TEAM B'
    matchModel.score1 = 0
    matchModel.score2 = 0
    matchModel.timeouts1 = 0
    matchModel.timeouts2 = 0
    matchModel.periodTime = '00:00'
    matchModel.isActive = true

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match_reset', payload)
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async useTimeout(matchId: number, team: TeamNumber) {
    return await this.takeTimeout(matchId, team)
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

    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'period_ended', {
      snapshot: payload,
      finalScore: {
        team1: payload.team1.score,
        team2: payload.team2.score,
      },
      currentSet: payload.currentSet,
    })

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

  public async updateSettings(
    matchId: number,
    payload: {
      team1Name?: string
      team2Name?: string
      currentSet?: number
      periodTime?: string | null
      status?: string
    }
  ) {
    let current = await this.getById(matchId)

    if (payload.team1Name !== undefined || payload.team2Name !== undefined) {
      current = await this.renameTeams(
        matchId,
        payload.team1Name ?? current.team1.name,
        payload.team2Name ?? current.team2.name
      )
    }

    if (payload.periodTime !== undefined) {
      current = await this.setClockTime(matchId, payload.periodTime)
    }

    if (payload.status === 'live') {
      current = await this.startPeriod(matchId)
    }

    if (payload.status === 'paused') {
      current = await this.endPeriod(matchId)
    }

    if (payload.currentSet !== undefined) {
      const matchModel = await this.getMatchOrFail(matchId)
      matchModel.currentSet = payload.currentSet
      await matchModel.save()

      const refreshedDomainMatch = MatchFactory.fromModel(matchModel)
      current = refreshedDomainMatch.serializeForScreen()

      await this.logEvent(matchModel.id, 'match.set_updated', {
        currentSet: payload.currentSet,
      })

      await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, current)
    }

    return current
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