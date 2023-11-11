'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GedipsSchema extends Schema {
  up () {
    this.table('Gedips', (table) => {
      // alter table
    })
  }

  down () {
    this.table('Gedips', (table) => {
      // reverse alternations
    })
  }
}

module.exports = GedipsSchema
