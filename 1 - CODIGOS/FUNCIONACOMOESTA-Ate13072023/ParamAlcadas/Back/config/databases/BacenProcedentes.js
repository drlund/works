/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  client: 'pg',
  connection: {
    host: '172.16.14.137',
    port: 5432,
    user: 'appSuperAdmDired',
    password: '#9009',
    database: 'postgres'
  },
  pool: { min: 0, max: 50 },
  debug: Env.get('DB_DEBUG', false)
}