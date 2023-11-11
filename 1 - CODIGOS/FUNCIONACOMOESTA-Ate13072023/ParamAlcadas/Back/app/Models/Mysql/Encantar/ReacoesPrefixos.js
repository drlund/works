/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ReacoesPrefixos extends Model {
  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'vwReacoesPrefixos';
  }

  static get primaryKey() {
    return null;
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

}

module.exports = ReacoesPrefixos;
