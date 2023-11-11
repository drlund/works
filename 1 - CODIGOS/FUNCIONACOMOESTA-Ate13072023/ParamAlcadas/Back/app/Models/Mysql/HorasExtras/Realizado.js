'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Realizado extends Model {

    static get connection () {
      return 'horasExtras'
    }

    static get table () {
      return 'vw_he_jornada_prefixo'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = Realizado;
