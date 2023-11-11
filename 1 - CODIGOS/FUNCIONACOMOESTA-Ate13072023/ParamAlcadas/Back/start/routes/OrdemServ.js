/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/ordemserv/inc', 'OrdemServicoController.findNodes').middleware(['isTokenValid:withRoles']);

// Route.get('/ordemserv/rotina', 'OrdemServicoController.testeCommandRotinaVerificacaoNoturna');

Route.group( () => {
  Route.get('minhasordens', 'OrdemServicoController.findByEstadoDaOrdem');
  Route.get('ordens-analisadas', 'OrdemServicoController.ordensAnalisadas');
  Route.get('historico-pessoal', 'OrdemServicoController.findHistoricoPessoal');
  Route.get('historico/:id', 'OrdemServicoController.findHistoricoOrdem').middleware(['podeVisualizarHistorico']);
  Route.get('ordem-estoque', 'OrdemServicoController.findOrdemEstoque').middleware(['podeVisualizarHistorico']);
  Route.get('acompanhamento/:id', 'OrdemServicoController.findAcompanhamentoOrdem').middleware(['isColaboradorOrdem']);
  Route.get('estados', 'OrdemServicoController.findEstados');
  Route.get('sugestoes/lista-gestores', 'OrdemServicoController.getListaGestores');
  Route.get('sugestoes/lista-instrucoes', 'OrdemServicoController.getListaInstrucoes');
  Route.post('/', 'OrdemServicoController.store').middleware(['podeCriarOrdem']);
  Route.patch('/', 'OrdemServicoController.store').middleware(['podeEditarOrdem']);
  Route.get('permite-assinar/:id', 'OrdemServicoController.permiteAssinar');
  Route.post('assinar/:id', 'OrdemServicoController.assinar');
  Route.post('dar-ciencia/:id', 'OrdemServicoController.darCiencia');
  Route.post('revogar/:id', 'OrdemServicoController.revogarOrdem');
  Route.get('find-participante', 'OrdemServicoController.findParticipanteByTipo');
  Route.get('edicao/:id', 'OrdemServicoController.findOrdemEdicao').middleware(['podeEditarOrdem']);
  Route.post('finalizar-rascunho/:id', 'OrdemServicoController.finalizarRascunho').middleware(['isColaboradorOrdem']);
  Route.post('voltar-rascunho/:id', 'OrdemServicoController.voltarParaRascunho').middleware(['isColaboradorOrdem']);
  Route.post('clonar-ordem', 'OrdemServicoController.clonarOrdem');
  Route.post('remover-autorizacao-consulta', 'OrdemServicoController.removerAutorizacaoConsulta');
  Route.post('link-publico/nova-senha/:id', 'OrdemServicoController.novaSenhaLinkPublico').middleware(['podeEditarOrdem']);
  Route.get('link-publico/visualizar/:hash', 'OrdemServicoController.findOrdem').middleware(['validateLinkPublico']);
  Route.get('link-publico/:id', 'OrdemServicoController.findLinkPublico').middleware(['podeEditarOrdem']);
  Route.post('link-publico/:id', 'OrdemServicoController.novoLinkPublico').middleware(['podeEditarOrdem']);
  Route.delete('link-publico/:id', 'OrdemServicoController.deleteLinkPublico').middleware(['podeEditarOrdem']);
  Route.delete('/:id', 'OrdemServicoController.deleteOrdem');
}).prefix('/ordemserv').middleware(['isTokenValid']);

//estas rotas precisam estar separadas pois necessitam dos papeis de acesso do usuario na verificacao do login.
Route.group( () => {
  Route.get('gerenciar/visualizar/:id', 'OrdemServicoController.findOrdem').middleware(['isManagerOrdem']);
  Route.get('ins-alteradas/:id', 'OrdemServicoController.findInsNormAlteradas').middleware(['podeVisualizarOrdem']);
  Route.post('confirmar-ins-alteradas', 'OrdemServicoController.confirmarInsNormAlteradas').middleware(['podeVisualizarOrdem']);
  Route.post('revogar-por-ins-alteradas', 'OrdemServicoController.revogarPorAltInsNormativas').middleware(['podeVisualizarOrdem']);
}).prefix('/ordemserv').middleware(['isTokenValid:withRoles']);
