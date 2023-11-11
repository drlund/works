'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DocumentosSchema extends Schema {
  up () {
    this.create('documentos', (table) => {
      table.increments('id_doc')
      table.integer('id_medida', 2).notNullable()
      table.text('texto_doc', 'longtext').notNullable()
    })
  }

  down () {
    this.drop('documentos')
  }
}

module.exports = DocumentosSchema
