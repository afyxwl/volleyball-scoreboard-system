import type { HttpContext } from '@adonisjs/core/http'
import MatchService from '#services/match/match_service'

export default class MatchesController {
  public async show({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.getById(Number(params.id))
  }

  public async updateScore({ params, request }: HttpContext) {
    const matchService = new MatchService()

    const body = request.only(['team', 'delta']) as {
      team: 1 | 2
      delta: number
    }

    return await matchService.updateScore(Number(params.id), body.team, body.delta)
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
    const body = request.only(['team']) as { team: 1 | 2 }

    return await matchService.useTimeout(Number(params.id), body.team)
  }

  public async startPeriod({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.startPeriod(Number(params.id))
  }

  public async endPeriod({ params }: HttpContext) {
    const matchService = new MatchService()
    return await matchService.endPeriod(Number(params.id))
  }
}