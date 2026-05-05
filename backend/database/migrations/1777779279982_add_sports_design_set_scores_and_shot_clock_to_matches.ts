import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('team1_color').notNullable().defaultTo('#67e8f9')
      table.string('team2_color').notNullable().defaultTo('#fda4af')
      table.string('font_family').notNullable().defaultTo('system')
      table.string('board_style').notNullable().defaultTo('neon')

      table.json('set_scores_json').nullable()

      table.integer('shot_clock_seconds').notNullable().defaultTo(24)
      table.boolean('shot_clock_running').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('team1_color')
      table.dropColumn('team2_color')
      table.dropColumn('font_family')
      table.dropColumn('board_style')
      table.dropColumn('set_scores_json')
      table.dropColumn('shot_clock_seconds')
      table.dropColumn('shot_clock_running')
    })
  }
}