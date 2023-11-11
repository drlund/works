/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/inc', 'BaseIncController.findNodes').middleware(['isTokenValid:withRoles']);
Route.get('/inc/search', 'BaseIncController.search').middleware(['isTokenValid:withRoles']);