'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MedidasSchema extends Schema {
  up () {
    this.table('medidas', (table) => {
      // alter table
    })
  }

  down () {
    this.table('medidas', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MedidasSchema
