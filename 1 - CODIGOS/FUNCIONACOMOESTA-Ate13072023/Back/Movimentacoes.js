// @ts-nocheck
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
  
  Route.get('/param-alcadas', 'Movimentacoes/ParamAlcadasController.getCompetenciaNomeacao');
  Route.get('/testa-parametros', 'Movimentacoes/TestaParametrosController.getParametros');
  Route.delete('/exclui-parametro', 'Movimentacoes/TestaParametrosController.delParametro');
  Route.post('/gravarParametro', 'Movimentacoes/TestaParametrosController.gravarParametro');
  Route.patch('/patchParametros', 'Movimentacoes/TestaParametrosController.patchParametros');
  Route.get('/getCargosComissoesFot09', 'Movimentacoes/TestaParametrosController.getCargosComissoesFot09');
  Route.get('/getJurisdicoesSubordinadas', 'Movimentacoes/TestaParametrosController.getJurisdicoesSubordinadas');
  Route.get('/getPrefixoBySubordinada', 'Movimentacoes/TestaParametrosController.getPrefixoBySubordinada');
  Route.get('/listaComiteParamAlcadas', 'Movimentacoes/TestaParametrosController.listaComiteParamAlcadas');

  Route.get('/verificarStatusParametro', 'Movimentacoes/TestaParametrosController.verificarStatusParametro');
  Route.get('/atualizarStatusParametro', 'Movimentacoes/TestaParametrosController.atualizarStatusParametro');
})
.prefix('/movimentacoes')
.middleware(['isTokenValid']);
