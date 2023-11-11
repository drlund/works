'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Coban extends Model {

    municipio () {
        return this.hasOne('App/Models/Mysql/coban/Municipio')
    }

    static get connection () {
        return 'coban'
      }

}

module.exports = Coban
