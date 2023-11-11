/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  client: 'mysql2',
  connection: {
    host: Env.get('DB_HOST', ''),
    port: Env.get('DB_PORT', ''),
    user: Env.get('DB_USER', ''),
    password: Env.get('DB_PASSWORD', ''),
    database: 'app_ctrl_disciplinar'
  },
  pool: { min: 0, max: 50 },
  debug: Env.get('DB_DEBUG', false)
}