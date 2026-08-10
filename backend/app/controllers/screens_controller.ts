import type { HttpContext } from '@adonisjs/core/http'
import Screen from '#models/screen'
import MatchService from '#services/match/match_service'

export default class ScreensController {
  public async index({ response }: HttpContext) {
    const screens = await Screen.query().preload('owner').orderBy('id', 'asc')
    return response.ok(screens)
  }

  /*public async store({ request, response }: HttpContext) {
    const payload = request.only(['name', 'slug', 'ownerUserId', 'isActive']) as {
      name: string
      slug: string
      ownerUserId?: number | null
      isActive?: boolean
    }

    const exists = await Screen.findBy('slug', payload.slug)
    if (exists) {
      return response.conflict({ message: 'Screen slug already exists' })
    }

    const screen = await Screen.create({
      name: payload.name,
      slug: payload.slug,
      ownerUserId: payload.ownerUserId ?? null,
      isActive: payload.isActive ?? true,
    })

    return response.created(screen)
  }*/
public async store({ request, response }: HttpContext) {
  const payload = request.only([
    'name',
    'slug',
    'ownerUserId',
    'isActive',
  ]) as {
    name?: string
    slug?: string | null
    ownerUserId?: number | null
    isActive?: boolean
  }

  const name = payload.name?.trim()

  if (!name) {
    return response.badRequest({
      message: 'Назва екрана обовʼязкова',
    })
  }

  let slug = payload.slug?.trim()

  if (!slug) {
    slug = `screen-${Date.now()}`
  }

  slug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')

  const exists = await Screen.findBy('slug', slug)

  if (exists) {
    return response.conflict({
      message: 'Екран з таким slug уже існує',
    })
  }

  const screen = await Screen.create({
    name,
    slug,
    ownerUserId: payload.ownerUserId ?? null,
    isActive: payload.isActive ?? true,
  })

  return response.created(screen)
}
  public async update({ params, request, response }: HttpContext) {
    const screen = await Screen.findOrFail(params.id)

    const payload = request.only(['name', 'slug', 'ownerUserId', 'isActive']) as {
      name?: string
      slug?: string
      ownerUserId?: number | null
      isActive?: boolean
    }

    if (payload.slug && payload.slug !== screen.slug) {
      const exists = await Screen.query().where('slug', payload.slug).whereNot('id', screen.id).first()

      if (exists) {
        return response.conflict({ message: 'Screen slug already exists' })
      }
    }

    screen.merge({
      name: payload.name ?? screen.name,
      slug: payload.slug ?? screen.slug,
      ownerUserId: payload.ownerUserId ?? screen.ownerUserId,
      isActive: payload.isActive ?? screen.isActive,
    })

    await screen.save()
    return response.ok(screen)
  }
  /*public async assignUser({ params, request }: HttpContext) {
    const screen = await Screen.findOrFail(params.id)
    const { userId } = request.body()

    screen.userId = userId
    await screen.save()

    return screen
  }*/
 public async assignUser({ params, request, response }: HttpContext) {
  const screen = await Screen.find(params.id)

  if (!screen) {
    return response.notFound({
      message: 'Екран не знайдено',
    })
  }

  const { userId } = request.only(['userId']) as {
    userId?: number | null
  }

  screen.ownerUserId = userId ?? null

  await screen.save()

  return response.ok(screen)
 }
        public async current({ params, response }: HttpContext) {
          const matchService = new MatchService()
          const data = await matchService.getCurrentByScreenId(Number(params.id))

          if (!data) {
            return response.notFound({ message: 'No active match for this screen' })
          }

          return data
        }
        public async destroy({ params, response }: HttpContext) {
        const screen = await Screen.find(params.id)

        if (!screen) {
          return response.notFound({
            message: 'Екран не знайдено',
          })
        }

        await screen.delete()

        return response.ok({
          message: 'Екран видалено',
        })
  }
}
