'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Compensacao extends Model {

    static get connection () {
      return 'horasExtras'
    }

    static get table () {
      return 'compensacao'
    }

    static get primaryKey () {
      return 'id'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = Compensacao;
