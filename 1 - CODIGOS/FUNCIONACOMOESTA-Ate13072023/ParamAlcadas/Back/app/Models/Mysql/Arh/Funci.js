'use strict'

const Model = use('Model')

class Funci extends Model {

  //CONFIG
  static get table () {
    return 'arhfot01'
  }

  static get primaryKey () {
    return 'matricula'
  }

  static get connection () {
    return 'dipes'
  }

  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  agLocaliz () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','ag_localiz','prefixo')
  }

  nomeGuerra () {
    return this.hasOne('App/Models/Mysql/NomeGuerra','matricula','matricula');
  }

  funcaoLotacao () {
    return this.hasOne('App/Models/Mysql/Arh/CargosComissoes','funcao_lotacao','cod_funcao')
  }

  ddComissao () {
    return this.hasOne('App/Models/Mysql/Arh/CargosComissoes','comissao','cod_funcao')
  }

  ddComissaoFot06 () {
    return this.hasOne('App/Models/Mysql/Arh/ComissoesFot06','comissao','cod_comissao')
  }

  ddComissaoFot05 () {
    return this.hasOne('App/Models/Mysql/Arh/ComissoesFot05','comissao','cod_comissao')
  }

  gfm () {
    return this.hasOne('App/Models/Mysql/movimentacoes/GruposFuncoes','comissao','cod_funcao')
  }

  prefixoLotacao () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','prefixo_lotacao','prefixo')
  }

  codUorLocalizacao () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','cod_uor_localizacao','uor_dependencia')
  }

  codUorLocalizacao2 () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','cod_uor_localizacao2 ','uor_dependencia')
  }

  uorTrabalho () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','uor_trabalho','uor_dependencia')
  }

  codUorTrabalho () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','cod_uor_trabalho','uor_dependencia')
  }

  codUorGrupo () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','cod_uor_grupo','uor_dependencia')
  }

  depLotacao () {
    return this.hasOne('App/Models/Mysql/Arh/Prefixo','dep_lotacao','prefixo')
  }

  codFuncLotacao () {
    return this.hasOne('App/Models/Mysql/Arh/CargosComissoes','cod_func_lotacao','codigo_func')
  }

  uor500g () {
    return this.hasOne('App/Models/Mysql/Arh/Uors500g','uor_trabalho','CodigoUOR')
  }

  uorLocaliz500g () {
    return this.hasOne('App/Models/Mysql/Arh/Uors500g','cod_uor_localizacao','CodigoUOR')
  }


  // MUTATORS
  getNome(nome){
    return nome.trim();
  }

}

module.exports = Funci
