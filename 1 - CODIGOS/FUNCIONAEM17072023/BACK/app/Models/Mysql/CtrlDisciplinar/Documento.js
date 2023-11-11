'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Documento extends Model {

    static get table () {
        return 'documentos'
    }

    static get connection () {
    return 'mysqlCtrlDisciplinar'
    }

    static get primaryKey () {
        return 'id_doc'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = Documento
