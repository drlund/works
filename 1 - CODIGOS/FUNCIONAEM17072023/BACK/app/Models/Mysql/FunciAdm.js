'use strict'

const Model = use('Model')

class FunciAdm extends Model {

  static get computed(){
    return ['cargo']
  }

  //CONFIG
  static get table () {
    return 'arhfot01_adm'
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


  static get visible() {
    return [
      'matricula',
      'nome',
      'email',
      'data_nasc' ,
      'data_posse',
      'grau_instr',
      'comissao',
      'desc_cargo',
      'cod_situacao',
      'data_situacao',
      'prefixo_lotacao',
      'desc_localizacao',
      'cod_uor_trabalho',
      'nome_uor_trabalho',
      'cod_uor_grupo',
      'nome_uor_grupo',
      'ddd_celular',
      'fone_celular',
      'sexo',
      'est_civil',
      'dt_imped_odi',
      'ag_localiz',
      'cargo',
      'nomePrefixo',
      'gerev',
      'super',
      'diretoria',
      'prefixo',
      'dt_imped_remocao',
      'dt_imped_comissionamento',
      'dt_imped_odi',
      'dt_imped_pas',
      'dt_imped_instit_relac',
      'dt_imped_demissao',
      'dt_imped_bolsa_estudos'
    ]
  }

  dependencia(){
    return this.hasOne('App/Models/Mysql/Dependencia','ag_localiz','prefixo')
  }

  nomeGuerra(){
    return this.hasOne('App/Models/Mysql/NomeGuerra','matricula','matricula');

  }

  // MUTATORS
  getNome(nome){
    return nome.trim();
  }

  getCargo({ desc_cargo}) {
    return String(desc_cargo).trim()
  }
}

module.exports = FunciAdm
