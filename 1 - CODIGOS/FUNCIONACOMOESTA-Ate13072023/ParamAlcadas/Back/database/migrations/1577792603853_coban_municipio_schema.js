'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MunicipioSchema extends Schema {

  static get connection () {
    return 'coban'
  }

  up () {
    this.createIfNotExists('municipios', (table) => {
      table.increments().unsigned()
      table.string('municipio', 100).notNullable()
      table.string('uf', 2).notNullable()
      table.integer('cd_ibge').notNullable()
      table.string('criticidade', 50).notNullable()
      table.string('agencia', 4)
      table.string('nome_empresa', 100).notNullable()
      table.string('ajuda_custo', 1).notNullable()
      table.string('coban_comum', 1).notNullable()
      table.string('coban_comum_bonb', 1).notNullable()
      table.string('ponto_estrategico', 1).notNullable()
      table.string('endereco_01', 150).notNullable()
      table.string('endereco_02', 150).notNullable()
      table.string('endereco_03', 150).notNullable()
      table.string('endereco_04', 150).notNullable()
      table.string('endereco_05', 150).notNullable()
      table.string('endereco_06', 150).notNullable()
      table.string('endereco_07', 150).notNullable()
      table.string('endereco_08', 150).notNullable()
      table.string('endereco_09', 150).notNullable()
      table.string('endereco_10', 150).notNullable()
      table.string('endereco_11', 150).notNullable()
      table.string('endereco_12', 150).notNullable()
    })
  }

  down () {
    this.drop('municipios')
  }
}

module.exports = MunicipioSchema
