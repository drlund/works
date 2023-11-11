'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HorasExtras extends Model {

    static get connection () {
      return 'horasExtras'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = HorasExtras;
