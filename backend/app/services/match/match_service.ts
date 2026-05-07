import Match from '#models/match'
import MatchEvent from '#models/match_event'
import MatchFactory from '#domain/factories/match_factory'
import BroadcastService from '#services/match/broadcast_service'
import type { SetScores, TeamNumber } from '#domain/match/abstract_match'

type SportType = 'volleyball' | 'basketball'

type MatchSettingsPayload = {
  sportType?: string
  team1Name?: string
  team2Name?: string
  currentSet?: number
  periodTime?: string | null
  status?: string
  team1Color?: string
  team2Color?: string
  fontFamily?: string
  boardStyle?: string
  setScores?: Partial<SetScores>
  shotClockSeconds?: number
  shotClockRunning?: boolean
}

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
    team1Color?: string
    team2Color?: string
    fontFamily?: string
    boardStyle?: string
    shotClockSeconds?: number
  }) {
    await Match.query()
      .where('screen_id', payload.screenId)
      .where('is_active', true)
      .update({ is_active: false })

    const sportType = this.normalizeSport(payload.sportType)

    const matchModel = await Match.create({
      screenId: payload.screenId,
      sportType,
      status: 'draft',
      team1Name: payload.team1Name ?? 'TEAM A',
      team2Name: payload.team2Name ?? 'TEAM B',
      score1: 0,
      score2: 0,
      fouls1: 0,
      fouls2: 0,
      currentSet: payload.currentSet ?? 1,
      timeouts1: 0,
      timeouts2: 0,
      periodTime: payload.periodTime ?? this.defaultPeriodTime(sportType),
      isActive: true,

      team1Color: this.normalizeColor(payload.team1Color, '#67e8f9'),
      team2Color: this.normalizeColor(payload.team2Color, '#fda4af'),
      fontFamily: this.normalizeFont(payload.fontFamily),
      boardStyle: payload.boardStyle ?? 'neon',
      setScoresJson: { team1: [], team2: [] },
      shotClockSeconds: this.normalizeShotClock(payload.shotClockSeconds ?? 24),
      shotClockRunning: false,
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

  public async getFinishedMatchesHistory() {
    const matches = await Match.query()
      .where('status', 'finished')
      .orderBy('updated_at', 'desc')

    return matches.map((match) => ({
      id: match.id,
      screenId: match.screenId,
      sportType: match.sportType,
      team1Name: match.team1Name,
      team2Name: match.team2Name,
      score1: match.score1,
      score2: match.score2,
      fouls1: match.fouls1,
      fouls2: match.fouls2,
      timeouts1: match.timeouts1,
      timeouts2: match.timeouts2,
      currentSet: match.currentSet,
      periodTime: match.periodTime,
      status: match.status,
      setScores: this.normalizeSetScores(match.setScoresJson),
      finishedAt: match.updatedAt,
    }))
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

  public async updateScore(matchId: number, team: TeamNumber, delta: number, periodTime?: string) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    if (team === 1) {
      matchModel.score1 = Math.max(0, matchModel.score1 + delta)
    } else {
      matchModel.score2 = Math.max(0, matchModel.score2 + delta)
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.score_updated', {
      team,
      delta,
      periodTime: matchModel.periodTime,
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async updateFouls(matchId: number, team: TeamNumber, delta: number, periodTime?: string) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    if (team === 1) {
      matchModel.fouls1 = Math.max(0, (matchModel.fouls1 ?? 0) + delta)
    } else {
      matchModel.fouls2 = Math.max(0, (matchModel.fouls2 ?? 0) + delta)
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.fouls_updated', {
      team,
      delta,
      periodTime: matchModel.periodTime,
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async updateShotClock(
    matchId: number,
    seconds: number,
    isRunning?: boolean,
    periodTime?: string
  ) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    matchModel.shotClockSeconds = this.normalizeShotClock(seconds)

    if (isRunning !== undefined) {
      matchModel.shotClockRunning = isRunning
    }

    await matchModel.save()

    await this.logEvent(matchModel.id, 'match.shot_clock_updated', {
      seconds: matchModel.shotClockSeconds,
      isRunning: matchModel.shotClockRunning,
      periodTime: matchModel.periodTime,
    })

    const domainMatch = MatchFactory.fromModel(matchModel)
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
    matchModel.fouls1 = 0
    matchModel.fouls2 = 0
    matchModel.timeouts1 = 0
    matchModel.timeouts2 = 0
    matchModel.periodTime = this.defaultPeriodTime(this.normalizeSport(matchModel.sportType))
    matchModel.isActive = true
    matchModel.setScoresJson = { team1: [], team2: [] }
    matchModel.shotClockSeconds = 24
    matchModel.shotClockRunning = false

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match_reset', payload)
    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async useTimeout(matchId: number, team: TeamNumber, periodTime?: string) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    if (team === 1) {
      matchModel.timeouts1 += 1
    } else {
      matchModel.timeouts2 += 1
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.timeout_taken', {
      team,
      periodTime: matchModel.periodTime,
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async startPeriod(matchId: number) {
    const matchModel = await this.getMatchOrFail(matchId)

    matchModel.status = 'live'

    if (!matchModel.periodTime) {
      matchModel.periodTime = this.defaultPeriodTime(this.normalizeSport(matchModel.sportType))
    }

    if (matchModel.sportType === 'basketball') {
      matchModel.shotClockRunning = true

      if (!matchModel.shotClockSeconds) {
        matchModel.shotClockSeconds = 24
      }
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.period_started', {
      periodTime: matchModel.periodTime,
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async pausePeriod(matchId: number, periodTime?: string) {
    const matchModel = await this.getMatchOrFail(matchId)

    matchModel.status = 'paused'
    matchModel.shotClockRunning = false

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.period_paused', {
      periodTime: matchModel.periodTime,
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  public async endPeriod(matchId: number, periodTime?: string, comment?: string) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (periodTime) {
      matchModel.periodTime = periodTime
    }

    if (matchModel.sportType === 'volleyball') {
      return await this.endVolleyballSet(matchModel, comment)
    }

    matchModel.status = 'finished'
    matchModel.isActive = true
    matchModel.shotClockRunning = false

    await matchModel.save()

    await this.logEvent(matchModel.id, 'match.finished', this.finishPayload(matchModel, comment))

    const domainMatch = MatchFactory.fromModel(matchModel)
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

  public async getScreenHistory(screenId: number) {
    const matches = await Match.query()
      .where('screenId', screenId)
      .where('status', 'finished')
      .orderBy('updatedAt', 'desc')

    return matches.map((match) => ({
      id: match.id,
      screenId: match.screenId,
      sportType: match.sportType,
      team1Name: match.team1Name,
      team2Name: match.team2Name,
      score1: match.score1,
      score2: match.score2,
      fouls1: match.fouls1,
      fouls2: match.fouls2,
      timeouts1: match.timeouts1,
      timeouts2: match.timeouts2,
      currentSet: match.currentSet,
      periodTime: match.periodTime,
      status: match.status,
      setScores: this.normalizeSetScores(match.setScoresJson),
      finishedAt: match.updatedAt,
    }))
  }

  public async updateSettings(matchId: number, payload: MatchSettingsPayload) {
    const matchModel = await this.getMatchOrFail(matchId)

    if (payload.sportType !== undefined) {
      matchModel.sportType = this.normalizeSport(payload.sportType)
    }

    if (payload.team1Name !== undefined) {
      matchModel.team1Name = payload.team1Name
    }

    if (payload.team2Name !== undefined) {
      matchModel.team2Name = payload.team2Name
    }

    if (payload.currentSet !== undefined) {
      matchModel.currentSet = payload.currentSet
    }

    if (payload.periodTime !== undefined) {
      matchModel.periodTime = payload.periodTime
    }

    if (payload.status !== undefined) {
      matchModel.status = payload.status
    }

    if (payload.team1Color !== undefined) {
      matchModel.team1Color = this.normalizeColor(payload.team1Color, '#67e8f9')
    }

    if (payload.team2Color !== undefined) {
      matchModel.team2Color = this.normalizeColor(payload.team2Color, '#fda4af')
    }

    if (payload.fontFamily !== undefined) {
      matchModel.fontFamily = this.normalizeFont(payload.fontFamily)
    }

    if (payload.boardStyle !== undefined) {
      matchModel.boardStyle = payload.boardStyle
    }

    if (payload.setScores !== undefined) {
      matchModel.setScoresJson = this.normalizeSetScores(payload.setScores)
    }

    if (payload.shotClockSeconds !== undefined) {
      matchModel.shotClockSeconds = this.normalizeShotClock(payload.shotClockSeconds)
    }

    if (payload.shotClockRunning !== undefined) {
      matchModel.shotClockRunning = payload.shotClockRunning
    }

    if (matchModel.sportType === 'basketball' && !matchModel.periodTime) {
      matchModel.periodTime = '10:00'
    }

    if (matchModel.sportType === 'volleyball' && !matchModel.periodTime) {
      matchModel.periodTime = '00:00'
    }

    await matchModel.save()

    const domainMatch = MatchFactory.fromModel(matchModel)
    const current = domainMatch.serializeForScreen()

    await this.logEvent(matchModel.id, 'match.settings_updated', {
      sportType: matchModel.sportType,
      team1Name: matchModel.team1Name,
      team2Name: matchModel.team2Name,
      currentSet: matchModel.currentSet,
      periodTime: matchModel.periodTime,
      status: matchModel.status,
      theme: {
        team1Color: matchModel.team1Color,
        team2Color: matchModel.team2Color,
        fontFamily: matchModel.fontFamily,
        boardStyle: matchModel.boardStyle,
      },
      setScores: this.normalizeSetScores(matchModel.setScoresJson),
      shotClock: {
        seconds: matchModel.shotClockSeconds,
        isRunning: matchModel.shotClockRunning,
      },
    })

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, current)

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

    matchModel.fouls1 = serialized.team1.fouls ?? matchModel.fouls1 ?? 0
    matchModel.fouls2 = serialized.team2.fouls ?? matchModel.fouls2 ?? 0

    matchModel.timeouts1 = serialized.team1.timeoutsUsed
    matchModel.timeouts2 = serialized.team2.timeoutsUsed

    matchModel.periodTime = serialized.clock.time

    matchModel.team1Color = serialized.theme?.team1Color ?? matchModel.team1Color
    matchModel.team2Color = serialized.theme?.team2Color ?? matchModel.team2Color
    matchModel.fontFamily = serialized.theme?.fontFamily ?? matchModel.fontFamily
    matchModel.boardStyle = serialized.theme?.boardStyle ?? matchModel.boardStyle
    matchModel.setScoresJson = serialized.setScores ?? matchModel.setScoresJson
    matchModel.shotClockSeconds = serialized.shotClock?.seconds ?? matchModel.shotClockSeconds
    matchModel.shotClockRunning = serialized.shotClock?.isRunning ?? matchModel.shotClockRunning

    await matchModel.save()
  }

  private async endVolleyballSet(matchModel: Match, comment?: string) {
    const currentSet = Math.max(1, matchModel.currentSet)
    const setScores = this.normalizeSetScores(matchModel.setScoresJson)

    if (currentSet <= 4) {
      setScores.team1[currentSet - 1] = matchModel.score1
      setScores.team2[currentSet - 1] = matchModel.score2

      await this.logEvent(matchModel.id, 'match.volleyball_set_finished', {
        comment: comment ?? null,
        set: currentSet,
        setScore: {
          team1: matchModel.score1,
          team2: matchModel.score2,
        },
        periodTime: matchModel.periodTime,
      })

      matchModel.setScoresJson = setScores
      matchModel.currentSet = currentSet + 1
      matchModel.score1 = 0
      matchModel.score2 = 0
      matchModel.fouls1 = 0
      matchModel.fouls2 = 0
      matchModel.timeouts1 = 0
      matchModel.timeouts2 = 0
      matchModel.periodTime = '00:00'
      matchModel.status = 'paused'
      matchModel.isActive = true
      matchModel.shotClockRunning = false

      await matchModel.save()

      const domainMatch = MatchFactory.fromModel(matchModel)
      const payload = domainMatch.serializeForScreen()

      await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

      return payload
    }

    matchModel.status = 'finished'
    matchModel.isActive = true
    matchModel.shotClockRunning = false

    await matchModel.save()

    await this.logEvent(matchModel.id, 'match.finished', this.finishPayload(matchModel, comment))

    const domainMatch = MatchFactory.fromModel(matchModel)
    const payload = domainMatch.serializeForScreen()

    await this.broadcaster.broadcastMatchUpdated(matchModel.screenId, payload)

    return payload
  }

  private finishPayload(matchModel: Match, comment?: string) {
    return {
      comment: comment ?? null,
      sportType: matchModel.sportType,
      periodTime: matchModel.periodTime,
      currentSet: matchModel.currentSet,
      finalScore: {
        team1: matchModel.score1,
        team2: matchModel.score2,
      },
      fouls: {
        team1: matchModel.fouls1,
        team2: matchModel.fouls2,
      },
      timeouts: {
        team1: matchModel.timeouts1,
        team2: matchModel.timeouts2,
      },
      setScores: this.normalizeSetScores(matchModel.setScoresJson),
    }
  }

  private normalizeSport(value?: string): SportType {
    return value === 'basketball' ? 'basketball' : 'volleyball'
  }

  private defaultPeriodTime(sportType: SportType) {
    return sportType === 'basketball' ? '10:00' : '00:00'
  }

  private normalizeShotClock(seconds: number) {
    return Math.max(0, Math.min(99, Math.floor(Number(seconds) || 0)))
  }

  private normalizeColor(value: string | undefined, fallback: string) {
    if (!value) return fallback
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
  }

  private normalizeFont(value?: string) {
    if (value === 'mono' || value === 'display') return value
    return 'system'
  }

  private normalizeSetScores(value: Partial<SetScores> | Match['setScoresJson'] | null): SetScores {
    if (!value) {
      return { team1: [], team2: [] }
    }

    const parsed = typeof value === 'string' ? JSON.parse(value) : value

    return {
      team1: Array.isArray(parsed?.team1) ? parsed.team1.slice(0, 4).map(Number) : [],
      team2: Array.isArray(parsed?.team2) ? parsed.team2.slice(0, 4).map(Number) : [],
    }
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