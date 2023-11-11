'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MailLog extends Model {

    static get table () {
        return 'mail_log'
    }

    static get connection () {
    return 'designacao'
    }

    static get primaryKey () {
        return 'id'
    }

    //campos do tipo date
    static get dates() {
        return super.dates.concat(['dt_envio'])
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = MailLog
