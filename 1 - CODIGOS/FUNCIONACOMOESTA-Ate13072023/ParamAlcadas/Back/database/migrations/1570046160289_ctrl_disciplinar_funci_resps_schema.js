'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FunciRespsSchema extends Schema {
  up () {
    this.create('funci_resps', (table) => {
      table.increments('id_funci_resp')
      table.integer('id_gedip', 11).notNullable()
      table.string('chave_funci_resp', 8)
      table.string('prefixo_resp', 4)
      table.datetime('dt_alt').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('funci_resps')
  }
}

module.exports = FunciRespsSchema
