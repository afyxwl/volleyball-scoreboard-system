import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Match from '#models/match'

export default class Screen extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'owner_user_id' })
  declare ownerUserId: number | null

  @belongsTo(() => User, {
    foreignKey: 'ownerUserId',
  })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => Match, {
    foreignKey: 'screenId',
  })
  declare matches: HasMany<typeof Match>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime | null
}