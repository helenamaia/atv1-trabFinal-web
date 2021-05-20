import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Raffles extends BaseSchema {
  protected tableName = 'raffles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('type_id').unsigned().notNullable().references('id').inTable('types')
      table.string('title').notNullable()
      table.text('description')
      table.dateTime('date_likely_sortition').notNullable()
      table.dateTime('date_start_sale').notNullable()
      table.dateTime('date_end_sale').notNullable()
      table.dateTime('date_sortition')
      table.float('price_ticket').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
