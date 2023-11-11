/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  connectionString: Env.get('MONGODB_URL_HOST', 'mongodb://app:desenv-02@172.16.12.105:27017')
}
