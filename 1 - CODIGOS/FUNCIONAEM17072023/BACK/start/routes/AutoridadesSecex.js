/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group( () => {
  Route.get('/publicoalvo', 'AutoridadesSecexController.getPublicAlvoAutoridades');
  Route.post('/publicoalvo', 'AutoridadesSecexController.addFunciPublicoAlvo');
  Route.delete('/publicoalvo', 'AutoridadesSecexController.deleteFunciPublicoAlvo');
  Route.get('/dadosautoridades', 'AutoridadesSecexController.getDadosAutoridades');
  Route.post('/processar-arquivo', 'AutoridadesSecexController.processaArquivoAutoridades');
}).prefix('autoridadessecex').middleware([ 'isTokenValid', 'isUserASecex']);

//rota sem autenticacao para consulta de aniversariantes
Route.get('autoridadessecex/consulta-aniversariantes', 'AutoridadesSecexController.getAniversariantesPorPeriodo');
Route.get('autoridadessecex/exporta-consulta-aniversariantes', 'AutoridadesSecexController.exportaAniversariantesPorPeriodo');