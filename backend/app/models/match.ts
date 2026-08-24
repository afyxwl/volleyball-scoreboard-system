import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Screen from '#models/screen'
import MatchEvent from '#models/match_event'

export type SetScoresJson = {
  team1: number[]
  team2: number[]
}

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'screen_id' })
  declare screenId: number

  @column({ columnName: 'sport_type' })
  declare sportType: string

  @column()
  declare status: string

  @column({ columnName: 'team1_name' })
  declare team1Name: string

  @column({ columnName: 'team2_name' })
  declare team2Name: string

  @column({ columnName: 'score1' })
  declare score1: number

  @column({ columnName: 'score2' })
  declare score2: number

  @column({ columnName: 'current_set' })
  declare currentSet: number

  @column({ columnName: 'timeouts1' })
  declare timeouts1: number

  @column({ columnName: 'timeouts2' })
  declare timeouts2: number

  @column({ columnName: 'period_time' })
  declare periodTime: string | null

  @column.dateTime({ columnName: 'clock_started_at' })
  declare clockStartedAt: DateTime | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean
  
  @column({ columnName: 'fouls1' })
  declare fouls1: number

  @column({ columnName: 'fouls2' })
  declare fouls2: number
  
  @column({ columnName: 'team1_color' })
  declare team1Color: string

  @column({ columnName: 'team2_color' })
  declare team2Color: string

  @column({ columnName: 'font_family' })
  declare fontFamily: string

  @column({ columnName: 'board_style' })
  declare boardStyle: string

  @column({ columnName: 'set_scores_json' })
  declare setScoresJson: SetScoresJson | string | null

  @column({ columnName: 'shot_clock_seconds' })
  declare shotClockSeconds: number

  @column({ columnName: 'shot_clock_running' })
  declare shotClockRunning: boolean

  @belongsTo(() => Screen)
  declare screen: BelongsTo<typeof Screen>

  @hasMany(() => MatchEvent, {
    foreignKey: 'matchId',
  })
  declare events: HasMany<typeof MatchEvent>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}