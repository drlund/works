/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group( () => {  
  Route.get('/excessoes-quorum-proprio', 'Movimentacoes/QuorumController.getQuorumProprio');
  Route.patch('/excessoes-quorum-proprio', 'Movimentacoes/QuorumController.updateQuorumProprio'); 
  Route.post('/excessoes-quorum-proprio', 'Movimentacoes/QuorumController.createQuorumProprio');
  Route.delete('/excessoes-quorum-proprio', 'Movimentacoes/QuorumController.deleteQuorumProprio'); 
 
  Route.get('/excessoes-quorum-todos', 'Movimentacoes/QuorumController.getQuorumTodos'); 
  Route.patch('/excessoes-quorum-qualquer', 'Movimentacoes/QuorumController.updateQuorumQualquer'); 
  Route.post('/excessoes-quorum-qualquer', 'Movimentacoes/QuorumController.createQuorumQualquer'); 
  Route.delete('/excessoes-quorum-qualquer/', 'Movimentacoes/QuorumController.deleteQuorumQualquer');
  
  Route.get('/getParametros', 'Movimentacoes/ParametrosAlcadasController.getParametros'); 
  Route.delete('/delParametro', 'Movimentacoes/ParametrosAlcadasController.delParametro'); 
  Route.post('/gravarParametro', 'Movimentacoes/ParametrosAlcadasController.gravarParametro');
  Route.patch('/patchParametros', 'Movimentacoes/ParametrosAlcadasController.patchParametros');
  Route.get('/getCargosComissoesFot09', 'Movimentacoes/ParametrosAlcadasController.getCargosComissoesFot09');
  Route.get('/getJurisdicoesSubordinadas', 'Movimentacoes/ParametrosAlcadasController.getJurisdicoesSubordinadas');
  Route.get('/getPrefixoBySubordinada', 'Movimentacoes/ParametrosAlcadasController.getPrefixoBySubordinada');
  Route.get('/listaComiteParamAlcadas', 'Movimentacoes/ParametrosAlcadasController.listaComiteParamAlcadas');

})
.prefix('/movimentacoes')
.middleware(['isTokenValid']);