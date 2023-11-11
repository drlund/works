/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/bacenproc', 'BacenProcedentesController.find').middleware(['isTokenValid', 'isUserBacenProc']);
Route.get('/bacenproc/exportar', 'BacenProcedentesController.exportarDados').middleware(['isTokenValid', 'isUserBacenProc']);
