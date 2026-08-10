import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fouls_1')
      table.dropColumn('fouls_2')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('fouls_1').defaultTo(0)
      table.integer('fouls_2').defaultTo(0)
    })
  }
}