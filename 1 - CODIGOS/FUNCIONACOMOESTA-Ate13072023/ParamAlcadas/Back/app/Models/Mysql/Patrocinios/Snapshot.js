'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Snapshot extends Model {
  static get connection() {
    return 'patrocinios';
  }

  static get table() {
    return 'snapshotComite';
  }

  // campos do tipo date
  static get dates() {
    return super.dates.concat(['dtComite']);
  }

  // formato de saida das datas
  static castDates (field, value) {
    return value.format('DD/MM/YYYY HH:mm');
  }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático deste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Snapshot
