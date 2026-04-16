import Match from '#models/match'
import Screen from '#models/screen'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const screen = await Screen.firstOrCreate(
      { slug: 'screen-1' },
      {
        name: 'Main Volleyball Screen',
        slug: 'screen-1',
        isActive: true,
      }
    )

    await Match.firstOrCreate(
      { screenId: screen.id },
      {
        screenId: screen.id,
        sportType: 'volleyball',
        status: 'draft',
        team1Name: 'Team A',
        team2Name: 'Team B',
        score1: 0,
        score2: 0,
        currentSet: 1,
        timeouts1: 0,
        timeouts2: 0,
        periodTime: '00:00',
        isActive: true,
      }
    )
  }
}