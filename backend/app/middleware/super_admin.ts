import type { HttpContext } from '@adonisjs/core/http'

export default class SuperAdminMiddleware {
  public async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    const user = auth.user

    if (!user || user.role !== 'super_admin') {
      return response.forbidden({ message: 'Доступ лише для супер-адміна' })
    }

    await next()
  }
}