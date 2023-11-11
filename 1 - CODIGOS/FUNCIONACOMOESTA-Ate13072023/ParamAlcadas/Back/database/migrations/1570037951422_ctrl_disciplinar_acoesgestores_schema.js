'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AcoesgestoresSchema extends Schema {
  up () {
    this.create('acoesgestores', (table) => {
      table.increments('id_acaogest')
      table.integer('id_gedip', 11).notNullable()
      table.integer('id_acao', 11).notNullable()
      table.string('funci', 8).notNullable()
      table.datetime('dt_acao').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('acoesgestores')
  }
}

module.exports = AcoesgestoresSchema
