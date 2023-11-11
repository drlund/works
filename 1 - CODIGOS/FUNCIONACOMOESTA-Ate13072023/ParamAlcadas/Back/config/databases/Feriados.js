/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  client: 'mysql2',
  connection: {
    host: Env.get('DB_HOST', '172.16.12.105'),
    port: Env.get('DB_PORT', '3306'),
    user: Env.get('DB_USER', 'root'),
    password: Env.get('DB_PASSWORD', 'desenv-02'),
    database: 'feriados'
  },
  pool: { min: 0, max: 50 }
}
