/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( () => {
  Route.get('/get-image/:connection/:imageHash', "ImagemController.findImage")
});