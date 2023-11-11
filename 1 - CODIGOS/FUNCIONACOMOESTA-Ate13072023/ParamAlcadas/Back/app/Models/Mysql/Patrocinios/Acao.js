'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TipoLancamento extends Model {
    static get connection() {
        return 'patrocinios';
    }

    static get table() {
        return 'acoes';
    }

    //campos do tipo date
    static get dates() {
        return super.dates.concat(['dtAtualizacao'])
    }

    //formato de saida das datas
    static castDates(field, value) {
        return value.format("DD/MM/YYYY hh:mm")
    }

    // impede a criação automática deste campo na tabela
    static get createdAtColumn() {
        return null;
    }

    // impede o update automático neste campo na tabela
    static get updatedAtColumn() {
        return null;
    }
}

module.exports = TipoLancamento
