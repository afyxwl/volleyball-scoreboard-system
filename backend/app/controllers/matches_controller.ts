import type { HttpContext } from '@adonisjs/core/http'
import MatchService from '#services/match/match_service'

export default class MatchesController {
  public async show({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.getById(Number(params.id))
  }

  public async getHistory({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.getHistory(Number(params.id))
  }

public async updateScore({ params, request }: HttpContext) {
  const matchService = new MatchService()

  const body = request.only(['team', 'delta', 'periodTime']) as {
    team: 1 | 2
    delta: number
    periodTime?: string
  }

  return await matchService.updateScore(
    Number(params.id),
    body.team,
    body.delta,
    body.periodTime
  )
}

public async updateFouls({ params, request }: HttpContext) {
  const matchService = new MatchService()

  const body = request.only(['team', 'delta', 'periodTime']) as {
    team: 1 | 2
    delta: number
    periodTime?: string
  }

  return await matchService.updateFouls(
    Number(params.id),
    body.team,
    body.delta,
    body.periodTime
  )
}
public async pausePeriod({ params, request }: HttpContext) {
  const matchService = new MatchService()
  const body = request.only(['periodTime']) as { periodTime?: string }

  return await matchService.pausePeriod(Number(params.id), body.periodTime)
}
  public async updateSettings({ params, request }: HttpContext) {
    const matchService = new MatchService()

    const body = request.only([
      'team1Name',
      'team2Name',
      'currentSet',
      'periodTime',
      'status',
    ])

    return await matchService.updateSettings(Number(params.id), body)
  }

 public async timeout({ params, request }: HttpContext) {
  const matchService = new MatchService()

  const body = request.only(['team', 'periodTime']) as {
    team: 1 | 2
    periodTime?: string
  }

  return await matchService.useTimeout(
    Number(params.id),
    body.team,
    body.periodTime
  )
}

  public async startPeriod({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.startPeriod(Number(params.id))
  }

public async endPeriod({ params, request }: HttpContext) {
  const matchService = new MatchService()
  const body = request.only(['periodTime', 'comment']) as {
    periodTime?: string
    comment?: string
  }

  return await matchService.endPeriod(Number(params.id), body.periodTime, body.comment)
}
public async screenHistory({ params }: HttpContext) {
  const matchService = new MatchService()
  return await matchService.getScreenHistory(Number(params.id))
}

  public async resetMatch({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.resetMatch(Number(params.id))
  }
  public async store({ request, response }: HttpContext) {
  const matchService = new MatchService()

  const body = request.only([
    'screenId',
    'sportType',
    'team1Name',
    'team2Name',
    'currentSet',
    'periodTime',
  ]) as {
    screenId: number
    sportType?: string
    team1Name?: string
    team2Name?: string
    currentSet?: number
    periodTime?: string | null
  }

  const data = await matchService.createMatch(body)
  return response.created(data)
}
}