'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BHFunci extends Model {

    static get connection () {
      return 'horasExtras'
    }

    static get table () {
      return 'bh_funcis'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = BHFunci;
