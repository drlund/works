'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExcessoesQuorum extends Model {

    // faz a conexão com o database
    static get connection() {
        return "movimentacoes";
    }

    // indica qual tabela usar
    static get table() {
        return "tb_excessoes_quorum";
    }
    
    //indica os campos do tipo date
    static get dates() {
        return super.dates.concat([
        "dtAtualizacao",
        ]);
    }

    //formato de saida das datas
    static castDates(field, value) {
        return value.format("DD/MM/YYYY hh:mm:ss");
    }
    

    // coluna de criação do dado
    static get createdAtColumn() {
        return null
    }

    // coluna de atualização do dado
    static get updatedAtColumn() {
        return null
    } 


}

module.exports = ExcessoesQuorum
