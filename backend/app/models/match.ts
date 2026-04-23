import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Screen from '#models/screen'
import MatchEvent from '#models/match_event'

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

  @column({ columnName: 'is_active' })
  declare isActive: boolean
  
  @column()
  declare fouls1: number

  @column()
  declare fouls2: number

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