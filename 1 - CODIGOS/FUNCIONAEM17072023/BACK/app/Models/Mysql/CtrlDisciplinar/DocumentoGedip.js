'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DocumentoGedip extends Model {

    static get table () {
        return 'documentos_gedips'
    }

    static get connection () {
    return 'mysqlCtrlDisciplinar'
    }

    static get primaryKey () {
        return 'id_doc_gedip'
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = DocumentoGedip
