'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Solicitacao extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'solicitacoes';
  }

  prefixo_orig () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo', 'pref_orig', 'prefixo')
  }

  prefixo_dest () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo', 'pref_dest', 'prefixo')
  }

  matricula_orig () {
    return this.hasOne('App/Models/Mysql/Funci', 'matr_orig', 'matricula')
  }

  matricula_dest () {
    return this.hasOne('App/Models/Mysql/Funci', 'matr_dest', 'matricula')
  }

  matricula_solicit () {
    return this.hasOne('App/Models/Mysql/Funci', 'matr_solicit', 'matricula')
  }

  matricula_resp () {
    return this.hasOne('App/Models/Mysql/Funci', 'responsavel', 'matricula')
  }

  optBasica () {
    return this.hasOne('App/Models/Mysql/Designacao/OptBasica', 'id_optbasica', 'id')
  }

  situacao () {
    return this.hasOne('App/Models/Mysql/Designacao/Situacao', 'id_situacao', 'id')
  }

  status () {
    return this.hasOne('App/Models/Mysql/Designacao/Status', 'id_status', 'id')
  }

  historico () {
    return this.hasMany('App/Models/Mysql/Designacao/Historico', 'id', 'id_solicitacao')
  }

  analise () {
    return this.hasOne('App/Models/Mysql/Designacao/Analise', 'id', 'id_solicitacao')
  }

  documento () {
    return this.hasMany('App/Models/Mysql/Designacao/Documento', 'id', 'id_solicitacao')
  }

  tipoDemanda () {
    return this.hasOne('App/Models/Mysql/Designacao/Tipo', 'tipo', 'id')
  }

  prefixo_encaminhado_para () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo', 'encaminhado_para', 'prefixo')
  }

  mail_log () {
    return this.hasMany('App/Models/Mysql/Designacao/MailLog', 'id', 'id_solicitacao')
  }

  funcaoOrigem () {
    return this.hasOne('App/Models/Mysql/Arh/ComissoesFot06', 'funcao_orig', 'cod_comissao')
  }

  funcaoDestino () {
    return this.hasOne('App/Models/Mysql/Arh/ComissoesFot06', 'funcao_dest', 'cod_comissao')
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }
}

module.exports = Solicitacao;
