'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MunicipioPriorizado extends Model {
    static get connection() {
        return 'coban'
    }

    static get table () {
        return 'municipios_priorizados'
    }
}

module.exports = MunicipioPriorizado
