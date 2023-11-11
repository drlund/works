'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AtividadeFuncionalidade extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'atividades_funcionalidades'
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = AtividadeFuncionalidade
