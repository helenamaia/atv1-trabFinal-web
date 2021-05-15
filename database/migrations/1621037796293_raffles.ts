import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Raffles extends BaseSchema {
  protected tableName = 'raffles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('type_id').unsigned().notNullable().references('id').inTable('types')
      table.string('titulo').notNullable()
      table.text('descricao')
      table.dateTime('data_provavel_sorteio').notNullable()
      table.dateTime('data_inicio_venda').notNullable()
      table.dateTime('data_fim_venda').notNullable()
      table.dateTime('data_sorteio')
      table.float('valor_bilhete').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
