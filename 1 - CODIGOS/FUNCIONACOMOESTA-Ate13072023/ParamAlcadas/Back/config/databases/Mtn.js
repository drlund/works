/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

module.exports = {
  client: "pg",
  connection: {
    host: Env.get("DB_HOST_POSTGRE", "172.16.15.161"),
    port: Env.get("DB_PORT_POSTGRE", 5432),
    user: Env.get("DB_USER_POSTGRE", "app"),
    password: Env.get("DB_PASSWORD_POSTGRE", "desenv-02"),
    database: Env.get("DB_DATABASE_POSTGRE", "mtn_desenv"),
  },
  pool: { min: 0, max: 50 },
  debug: Env.get("DB_DEBUG", false),
};
