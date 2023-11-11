'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseHorasExtras extends Model {

    static get connection () {
      return 'baseHorasExtras'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = BaseHorasExtras;
