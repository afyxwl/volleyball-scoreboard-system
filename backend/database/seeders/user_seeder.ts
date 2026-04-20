import User from '#models/user'

export default class UserSeeder {
  public async run() {
    const existing = await User.findBy('email', 'admin@example.com')

    if (existing) return

    await User.create({
      email: 'admin@example.com',
      password: 'admin12345',
    })
  }
}