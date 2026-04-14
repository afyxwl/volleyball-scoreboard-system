import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'match_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('match_id')
        .unsigned()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE')

      table.string('event_type').notNullable()
      table.json('payload_json').nullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}