'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DocumentosGedipSchema extends Schema {
  up () {
    this.create('documentos_gedips', (table) => {
      table.increments('id_doc_gedip')
      table.integer('id_gedip')
      table.text('texto_doc', 'longtext')
      table.string('funci_acesso', 8)
      table.datetime('dt_doc').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('documentos_gedips')
  }
}

module.exports = DocumentosGedipSchema
