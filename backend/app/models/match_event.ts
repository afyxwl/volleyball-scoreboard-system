import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Match from '#models/match'

export default class MatchEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare matchId: number

  @column()
  declare eventType: string

  @column()
  declare payloadJson: Record<string, unknown> | null

  @belongsTo(() => Match)
  declare match: BelongsTo<typeof Match>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}