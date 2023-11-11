/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const ELOGIOS_COMMON_MIDDLEWARE = ['isTokenValid', 'isUser'];
Route.get('/elogios', 'ElogioController.findAll').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);
Route.get('/elogios/historico', 'ElogioController.findAllHistorico').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);
Route.get('/elogios/historico-odi', 'ElogioController.findAllHistoricoODI').middleware([...ELOGIOS_COMMON_MIDDLEWARE, 'canViewODI']);
Route.post('/elogios', 'ElogioController.salvarElogio').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);
Route.patch('/elogios', 'ElogioController.salvarElogio').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);
Route.delete('/elogios', 'ElogioController.deleteElogio').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);
Route.post('/elogios/autorizar-envio', 'ElogioController.autorizarEnvios').middleware(['isTokenValid', 'isManagerElogios']);
Route.get('/elogios/exportar', 'ElogioController.exportarElogios').middleware(['isTokenValid', 'isManagerElogios']);
Route.get('/elogios/:id', 'ElogioController.find').middleware([...ELOGIOS_COMMON_MIDDLEWARE]);