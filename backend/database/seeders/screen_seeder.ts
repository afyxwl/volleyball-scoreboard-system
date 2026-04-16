import Screen from '#models/screen'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Screen.firstOrCreate(
      { slug: 'screen-1' },
      {
        name: 'Main Volleyball Screen',
        slug: 'screen-1',
        isActive: true,
      }
    )
  }
}