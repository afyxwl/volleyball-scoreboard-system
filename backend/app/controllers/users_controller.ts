import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'

export default class UsersController {
  public async index({ response }: HttpContext) {
    const users = await User.query().orderBy('id', 'asc')

    return response.ok(
      users.map((user) => ({
        ...UserTransformer.transform(user),
        role: user.role,
      }))
    )
  }

public async store({ request, response }: HttpContext) {
  const payload = request.only(['fullName', 'email', 'password', 'role']) as {
    fullName?: string | null
    email?: string
    password?: string
    role?: 'admin' | 'operator'
  }

  if (!payload.email || !payload.password) {
    return response.badRequest({
      message: 'email and password are required',
    })
  }

  const existing = await User.findBy('email', payload.email)
  if (existing) {
    return response.conflict({ message: 'User with this email already exists' })
  }

  const user = await User.create({
    fullName: payload.fullName ?? null,
    email: payload.email,
    password: payload.password,
    role: payload.role ?? 'operator',
  })

  return response.created({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  })
}
public async destroy({ params, auth, response }: HttpContext) {
  const user = await User.find(params.id)

  if (!user) {
    return response.notFound({
      message: 'Користувача не знайдено',
    })
  }

  const currentUser = auth.user

  if (currentUser?.id === user.id) {
    return response.badRequest({
      message: 'Не можна видалити власний обліковий запис',
    })
  }

  await user.delete()

  return response.ok({
    message: 'Користувача видалено',
  })
}
}