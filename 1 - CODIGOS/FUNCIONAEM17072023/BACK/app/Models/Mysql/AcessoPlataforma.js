'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AcessoPlataforma extends Model {


  // static get computed(){
  //   return ['diretoria', 'super', 'gerev']
  // }

  static get connection () {
    return 'acessos'
  }

  static get table () {
    return 'tb_acessos_plataformas'
  }

  static get primaryKey () {
    return 'matricula'
  }

  // static get incrementing () {
  //   return false
  // }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  // getNomePrefixo({getNomePrefixo}){
  //   return nome;
  // }

  // getDiretoria({diretoria}){
  //   return diretoria;
  // }

  // getSuper({superintendencia}){
  //   return superintendencia;
  // }

  // getGerev({gerev}){
  //   return gerev;
  // }

  // static get visible () {
  //   return [
  //     'prefixo',
  //     'nome',
  //     'cd_subord' ,
  //     'uor_dependencia',
  //     'cd_gerev_juris',
  //     'cd_super_juris',
  //     'cd_diretor_juris',
  //     'nomePrefixo',
  //     'email',
  //     'diretoria',
  //     'super',
  //     'gerev'
  //   ]
  // }

}

module.exports = AcessoPlataforma
