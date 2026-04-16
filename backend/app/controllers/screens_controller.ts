import type { HttpContext } from '@adonisjs/core/http'
import Screen from '#models/screen'
import MatchService from '#services/match/match_service'

export default class ScreensController {
  public async index() {
    return await Screen.all()
  }

  public async current({ params, response }: HttpContext) {
    const matchService = new MatchService()
    const data = await matchService.getCurrentByScreenId(Number(params.id))

    if (!data) {
      return response.notFound({ message: 'No active match for this screen' })
    }

    return data
  }
}