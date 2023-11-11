'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Gedip extends Model {

  static get table() {
    return 'gedips'
  }

  static get connection() {
    return 'mysqlCtrlDisciplinar'
  }

  static get primaryKey() {
    return 'id_gedip'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dt_julgamento_gedip', 'dt_limite_execucao', 'dt_conclusao', 'dt_retorno'])
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  func_gedip() {
    return this.hasOne('App/Models/Mysql/Funci', 'funcionario_gedip', 'matricula')
  }

  func_inclusao_gedip() {
    return this.hasOne('App/Models/Mysql/Funci', 'funci_inclusao_gedip', 'matricula')
  }

  func_alteracao_gedip() {
    return this.hasOne('App/Models/Mysql/Funci', 'funci_alteracao_gedip', 'matricula')
  }

  pref_inclusao_gedip() {
    return this.hasOne('App/Models/Mysql/Dependencia', 'prefixo_inclusao_gedip', 'prefixo')
  }

  comite() {
    return this.hasOne('App/Models/Mysql/CtrlDisciplinar/Comite', 'comite_gedip', 'id_comite')
  }

  medida() {
    return this.hasOne('App/Models/Mysql/CtrlDisciplinar/Medida', 'id_medida', 'id_medida')
  }

  status() {
    return this.hasOne('App/Models/Mysql/CtrlDisciplinar/Acao', 'status_gedip', 'id_acao')
  }

  funci_resp() {
    return this.hasOne('App/Models/Mysql/CtrlDisciplinar/FunciResp', 'id_gedip', 'id_gedip')
  }

  docs() {
    return this.hasMany('App/Models/Mysql/CtrlDisciplinar/AcoesGestores', 'id_gedip', 'id_gedip')
  }

  // profile () {
  //     return ({
  //         funciResp: this.hasOne('App/Models/Mysql/CtrlDisciplinar/FunciResp'),
  //         documentosGedip: this.hasOne('App/Models/Mysql/CtrlDisciplinar/DocumentosGedip'),
  //         statusGedip: this.hasOne('App/Models/Mysql/CtrlDisciplinar/StatusGedip'),
  //     });
  // }

}

module.exports = Gedip
