'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StatusGedip extends Model {

    static get table () {
        return 'status_gedips'
    }

    static get connection () {
    return 'mysqlCtrlDisciplinar'
    }

    static get primaryKey () {
        return 'id_status'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }


}

module.exports = StatusGedip
