'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CobanSchema extends Schema {

  static get connection () {
    return 'coban'
  }

  up () {
    this.createIfNotExists('cobans', (table) => {
      table.increments('id').primary
      table.string('ag_madrinha', 4).notNullable()
      table.string('cnpj', 13).notNullable()
      table.integer('municipio_id')
      table.string('restr_imped', 1)
      table.string('nome_resp', 100)
      table.string('telefone_resp', 14)
      table.text('descr_atividade')
      table.timestamps()
    })
  }

  down () {
    this.drop('cobans')
  }
}

module.exports = CobanSchema
