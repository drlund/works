'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EquipeComunicacao extends Model {
  static get connection() {
    return 'patrocinios';
  }
  
  static get table() {
    return 'equipeComunicacao';
  }
  
  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtAtualizacao'])
  }
  
  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }
  
  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }
  
  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
  
  // Campos que serão visíveis
  static get visible() {
    return ['matricula', 'nome']
  }
}

module.exports = EquipeComunicacao
