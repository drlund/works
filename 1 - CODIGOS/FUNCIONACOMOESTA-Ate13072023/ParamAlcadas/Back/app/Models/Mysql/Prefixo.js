'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Prefixo extends Model {


  static get computed(){
    return ['diretoria', 'super', 'gerev']
  }

  static get connection () {
    return 'dipes'
  }

  static get table () {
    return 'mst606_sb00'
  }

  static get primaryKey () {
    return 'prefixo'
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

  // getNomePrefixo({getNomePrefixo}){
  //   return nome;
  // }

  getDiretoria({cd_diretor_juris}){
    return cd_diretor_juris;
  }

  getSuper({cd_super_juris}){
    return cd_super_juris;
  }

  getGerev({cd_gerev_juris}){
    return cd_gerev_juris;
  }


  dadosDiretoria () {
    return this.hasOne('App/Models/Mysql/Prefixo','cd_diretor_juris','prefixo');
  }

  dadosSuper () {
    return this.hasOne('App/Models/Mysql/Prefixo','cd_super_juris','prefixo');
  }

  dadosGerev () {
    return this.hasOne('App/Models/Mysql/Prefixo','cd_gerev_juris','prefixo');
  }

  email () {
    return this.hasOne('App/Models/Mysql/Arh/Mstd503e','uor_dependencia','CodigodaUOR');
  }


}

module.exports = Prefixo
