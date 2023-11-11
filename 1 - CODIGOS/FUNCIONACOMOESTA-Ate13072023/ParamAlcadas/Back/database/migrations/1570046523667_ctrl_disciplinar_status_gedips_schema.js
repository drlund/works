'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatusGedipsSchema extends Schema {
  up () {
    this.create('status_gedips', (table) => {
      table.integer('id_status').notNullable().index()
      table.string('nm_status', 20)
      table.string('cor_status', 10)
    })
  }

  down () {
    this.drop('status_gedips')
  }
}

module.exports = StatusGedipsSchema
