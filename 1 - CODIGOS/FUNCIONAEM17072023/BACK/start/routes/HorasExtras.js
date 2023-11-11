/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/testes', 'HorasExtrasController.testesdb2');
  Route.get('/adesaohe', 'HorasExtrasController.getDadosAdesaoHE');
  Route.get('/getperiodos', 'HorasExtrasController.getPeriodos');
  Route.get('/getdadossolicitacaohe', 'HorasExtrasController.getDadosSolicitacaoHE');
  Route.get('/funcisporprefixo', 'HorasExtrasController.getFuncisPrefixo');
  Route.get('/getdadosresumohegg', 'HorasExtrasController.getResumoHEGG');
  Route.get('/getestadossolicitacoes', 'HorasExtrasController.getEstadosSolicitacoes');
  Route.get('/getperiodoestados', 'HorasExtrasController.getPeriodoEstados');
  Route.get('/getsolicitacoesacomp', 'HorasExtrasController.getSolicitacoesAcomp');
  Route.get('/getsolicitacao', 'HorasExtrasController.getSolicitacao');
  Route.get('/getregionais', 'HorasExtrasController.getRegionais');
  Route.get(`/ispermitido`, 'HorasExtrasController.podeAcessar');
  Route.get(`/teste`, 'HorasExtrasController.testGetConsultasBDHorasExtras');
  Route.get('/podesolicitar', 'HorasExtrasController.podeSolicitar');
  Route.post(`/teste`, 'HorasExtrasController.testGetConsultasBDHorasExtras');
  Route.post('/addsolicitacao', 'HorasExtrasController.novaSolicitacao');
  Route.patch('/addparecer', 'HorasExtrasController.enviarParecer');
  Route.get('/getlistadiasuteis', 'HorasExtrasController.obterListaDiasUteis');
}).prefix('/hrxtra').middleware(['isTokenValid']);