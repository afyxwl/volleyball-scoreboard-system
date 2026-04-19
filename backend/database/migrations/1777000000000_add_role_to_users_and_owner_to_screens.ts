import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.string('role').notNullable().defaultTo('admin')
    })

    this.schema.alterTable('screens', (table) => {
      table
        .integer('owner_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('screens', (table) => {
      table.dropForeign(['owner_user_id'])
      table.dropColumn('owner_user_id')
    })

    this.schema.alterTable('users', (table) => {
      table.dropColumn('role')
    })
  }
}