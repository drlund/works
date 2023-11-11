/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('acessoteste', 'DesignacaoController.acessoTeste');
  Route.get('checadeacordo', 'DesignacaoController.checaDeAcordo');
  Route.get('compareVRDestOrig', 'DesignacaoController.compareVRDestOrig');
  Route.get('concluidos', 'DesignacaoController.getConcluidos');
  Route.get('consultas', 'DesignacaoController.consultas');
  Route.get('depesubord', 'DesignacaoController.findDepESubordArh');
  Route.get('dotacao', 'DesignacaoController.findDotacaoDependencia');
  Route.get('exportar', 'DesignacaoController.exportaConsulta');
  Route.get('getalltemplates', 'DesignacaoController.getAllTemplates');
  Route.get('getAllTiposHistoricos', 'DesignacaoController.getTodosTiposHistoricos');
  Route.get('getAnalise', 'DesignacaoController.getAnalise');
  Route.get('getausprogr', 'DesignacaoController.getAusProgr');
  Route.get('getDeAcordo', 'DesignacaoController.getdeAcordo');
  Route.get('getDiasNaoUteis', 'DesignacaoController.getDiasNaoUteis');
  Route.get('getDiaUtil', 'DesignacaoController.getDiaUtil');
  Route.get('getdocumento', 'DesignacaoController.getDocumento');
  Route.get('getFunciJaSolicitado', 'DesignacaoController.getFunciJaSolicitado');
  Route.get('getHistorico', 'DesignacaoController.getHistorico');
  Route.get('getOrigem', 'DesignacaoController.getOrigem');
  Route.get('getPendencias', 'DesignacaoController.getPendencias'); // ok
  Route.get('getprefsubord', 'DesignacaoController.getPrefSubord');
  Route.get('getProtocolo', 'DesignacaoController.getProtocolo');
  Route.get('getQtdeDias', 'DesignacaoController.getQtdeDias');
  Route.get('getoptionsinstancias', 'DesignacaoController.getTipoHistoricos');
  Route.get('getResponsavel', 'DesignacaoController.getResponsavel');
  Route.get('getSituacoes', 'DesignacaoController.getSituacoes');
  Route.get('getSolicitacao', 'DesignacaoController.getSolicitacao');
  Route.get('getStatus', 'DesignacaoController.getStatus');
  Route.get('getprefixosteste', 'DesignacaoController.getPrefixosTeste');
  Route.get('gettemplates', 'DesignacaoController.getTemplates');
  Route.get('getTipoAcesso', 'DesignacaoController.getTipoAcesso');
  Route.get('getTipoHistorico', 'DesignacaoController.getTipoHistorico');
  Route.get('getTipoHistoricoById', 'DesignacaoController.getTipoHistoricoById');
  Route.get('matchcodausencia', 'DesignacaoController.findMatchedCodsAusencia');
  Route.get('matchedfuncis', 'DesignacaoController.findMatchedFuncis');
  Route.get('matchedfuncislotados', 'DesignacaoController.findMatchedFuncisLotados');
  Route.get('matchedfuncismovimentados', 'DesignacaoController.findMatchedFuncisMovimentados');
  Route.get('negativas', 'DesignacaoController.getNegativas');
  Route.get('optsbasicas', 'DesignacaoController.loadOptsBasicas');
  Route.get('teste', 'DesignacaoController.teste');
  Route.get('testedadoscomite', 'DesignacaoController.testeDadosComite');
  Route.get('testes', 'DesignacaoController.testes');
  Route.get('testgetprimgestor', 'DesignacaoController.testGetPrimGestor');
  Route.get('tipoAcesso', 'DesignacaoController.getTipoAcesso');
  Route.get('tipos', 'DesignacaoController.loadTipos');
  Route.patch('concluir', 'DesignacaoController.setConcluir');
  Route.patch('settemplate', 'DesignacaoController.setTemplate');
  Route.post('analise', 'DesignacaoController.getAnaliseFunci');
  Route.post('getDestino', 'DesignacaoController.getDestino');
  Route.post('gravar', 'DesignacaoController.gravarSolicitacao');
  Route.post('setDeAcordo', 'DesignacaoController.setdeAcordo');
  Route.post('setDocumento', 'DesignacaoController.setDocumento');
  Route.post('setFilesNegativas', 'DesignacaoController.setFilesNegativas');
  Route.post('setResponsavel', 'DesignacaoController.setResponsavel');
}).prefix('/desigint').middleware(['isTokenValid']);

// Rotas de teste
Route.group(() => {

}).prefix('/desigint');
