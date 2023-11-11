'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Municipio extends Model {
    static get connection() {
        return 'coban'
    }

    static get table() {
        return 'municipios'
    }

    static get visible() {
        return ['cd_ibge', 'municipio', 'uf']
    }
}

module.exports = Municipio
