'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class In extends Model {
    static get table () {
        return 'Base_IN.tb_in_vigente'
    }

    static get connection () {
        return 'mysqlBaseINC'
        }
}

module.exports = In
