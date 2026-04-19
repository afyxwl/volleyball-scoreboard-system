import type { HttpContext } from '@adonisjs/core/http'
import MatchService from '#services/match/match_service'

export default class MatchController {
  private matchService = new MatchService()

  public async index({ response }: HttpContext) {
    const matches = await this.matchService.getAllMatches()
    return response.ok(matches)
  }

  public async show({ params, response }: HttpContext) {
    const match = await this.matchService.getSerializedMatch(Number(params.id))
    return response.ok(match)
  }

  public async addPoint({ params, response }: HttpContext) {
    const matchId = Number(params.id)
    const team = Number(params.team) as 1 | 2

    const result = await this.matchService.addPoint(matchId, team)
    return response.ok(result)
  }

  public async removePoint({ params, response }: HttpContext) {
    const matchId = Number(params.id)
    const team = Number(params.team) as 1 | 2

    const result = await this.matchService.removePoint(matchId, team)
    return response.ok(result)
  }

  public async takeTimeout({ params, response }: HttpContext) {
    const matchId = Number(params.id)
    const team = Number(params.team) as 1 | 2

    const result = await this.matchService.takeTimeout(matchId, team)
    return response.ok(result)
  }

  public async startPeriod({ params, response }: HttpContext) {
    const result = await this.matchService.startPeriod(Number(params.id))
    return response.ok(result)
  }

  public async endPeriod({ params, response }: HttpContext) {
    const result = await this.matchService.endPeriod(Number(params.id))
    return response.ok(result)
  }
}