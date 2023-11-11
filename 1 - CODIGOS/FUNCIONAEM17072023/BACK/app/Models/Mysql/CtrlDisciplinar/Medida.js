'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Medida extends Model {

    static get table () {
        return 'medidas'
    }

    static get connection () {
    return 'mysqlCtrlDisciplinar'
    }

    static get primaryKey () {
        return 'id_medida'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }
}

module.exports = Medida
