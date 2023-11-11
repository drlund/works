'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AcoesSchema extends Schema {
  up () {
    this.create('acoes', (table) => {
      table.integer('id_acao').index()
      table.string('nm_acao', 10)
    })
  }

  down () {
    this.drop('acoes')
  }
}

module.exports = AcoesSchema
