const Env = use('Env')

module.exports = {
  client: 'mysql2',
  connection: {
    host: Env.get('DB_HOST', ''),
    port: Env.get('DB_PORT', ''),
    user: Env.get('DB_USER', ''),
    password: Env.get('DB_PASSWORD', ''),
    database: 'painelGestor',
	  debug: Env.get('DB_DEBUG', false),
  }
}