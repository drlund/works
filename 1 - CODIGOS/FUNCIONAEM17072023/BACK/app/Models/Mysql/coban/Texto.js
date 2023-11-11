'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Texto extends Model {
    static get connection () {
        return 'coban'
      }
}

module.exports = Texto
