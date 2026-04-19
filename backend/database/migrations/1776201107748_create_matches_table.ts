import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('screen_id')
        .unsigned()
        .references('id')
        .inTable('screens')
        .onDelete('CASCADE')

      table.string('sport_type').notNullable().defaultTo('volleyball')
      table.string('status').notNullable().defaultTo('draft')

      table.string('team1_name').notNullable()
      table.string('team2_name').notNullable()

      table.integer('score1').notNullable().defaultTo(0)
      table.integer('score2').notNullable().defaultTo(0)

      table.integer('current_set').notNullable().defaultTo(1)
      table.integer('timeouts1').notNullable().defaultTo(0)
      table.integer('timeouts2').notNullable().defaultTo(0)

      table.string('period_time').nullable()

      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}