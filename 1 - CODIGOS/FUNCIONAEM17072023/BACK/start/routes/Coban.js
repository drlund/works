/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/coban/municipios', 'coban/MunicipioController.index').middleware(['isTokenValid']);
Route.get('/coban/municipio', 'coban/MunicipioController.show').middleware(['isTokenValid']);
Route.get('/coban/municipiosprior', 'coban/MunicipioPriorizadoController.index').middleware(['isTokenValid']);
Route.get('/coban/municipioprior', 'coban/MunicipioPriorizadoController.show').middleware(['isTokenValid']);
Route.get('/coban/cobans', 'coban/CobanController.index').middleware(['isTokenValid']);
Route.get('/coban/coban/:id', 'coban/CobanController.show').middleware(['isTokenValid']);
Route.post('/coban/coban', 'coban/CobanController.store').middleware(['isTokenValid']);
Route.get('/coban/cnpjexiste', 'coban/CobanController.cnpjexiste').middleware(['isTokenValid']);
Route.get('/coban/texto', 'coban/TextoController.show').middleware(['isTokenValid']);
Route.get('/coban/codsibgeprior', 'coban/MunicipioPriorizadoController.codigosIbge').middleware(['isTokenValid']);