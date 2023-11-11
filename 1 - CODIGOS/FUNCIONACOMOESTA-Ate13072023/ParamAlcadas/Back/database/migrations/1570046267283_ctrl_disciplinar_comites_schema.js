'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComitesSchema extends Schema {
  up () {
    this.create('comites', (table) => {
      table.integer('id_comite').notNullable().unique().index()
      table.string('nm_comite').notNullable()
    })
  }

  down () {
    this.drop('comites')
  }
}

module.exports = ComitesSchema
