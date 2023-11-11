'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Acao extends Model {

    static get table () {
        return 'acoes'
    }

    static get connection () {
    return 'mysqlCtrlDisciplinar'
    }

    static get primaryKey () {
        return 'id_acao'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = Acao
