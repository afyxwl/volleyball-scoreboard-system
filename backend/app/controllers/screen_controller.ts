import type { HttpContext } from '@adonisjs/core/http'
import Screen from '#models/screen'
import Match from '#models/match'
import MatchFactory from '#domain/factories/match_factory'

export default class ScreenController {
  public async index({ response }: HttpContext) {
    const screens = await Screen.all()
    return response.ok(screens)
  }

  public async show({ params, response }: HttpContext) {
    const screen = await Screen.findOrFail(params.id)
    return response.ok(screen)
  }

  public async current({ params, response }: HttpContext) {
    const screenId = Number(params.id)

    const match = await Match.query()
      .where('screen_id', screenId)
      .orderBy('id', 'desc')
      .first()

    if (!match) {
      return response.notFound({
        message: 'No active match found for this screen',
      })
    }

    const domainMatch = MatchFactory.fromModel(match)
    return response.ok(domainMatch.serializeForScreen())
  }
}