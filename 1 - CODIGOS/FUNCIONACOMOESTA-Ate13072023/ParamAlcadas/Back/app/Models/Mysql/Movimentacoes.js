'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Movimentacoes extends Model {

    static get connection() {
        return "movimentacoes";
    }

    static get createdAtColumn() {
        return null
    }

    static get updatedAtColumn() {
        return null
    }

}

module.exports = Movimentacoes;
