import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Awards extends BaseSchema {
  protected tableName = 'awards'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('raffle_id').unsigned().notNullable().references('id').inTable('raffles')
      table.string('description').notNullable()
      table.integer('colocation').notNullable()
      table.integer('ticket_drawn')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
