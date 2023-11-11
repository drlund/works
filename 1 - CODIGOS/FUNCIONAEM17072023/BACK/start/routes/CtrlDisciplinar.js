/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.resource('acoes', 'CtrlDisciplinar/AcaoController');
  Route.resource('acoesgestores', 'CtrlDisciplinar/MedidaController');
  Route.resource('comites', 'CtrlDisciplinar/ComiteController');
  Route.get('cobranca', 'CtrlDisciplinar/DocumentoController.cobranca');
  Route.resource('docsgedips', 'CtrlDisciplinar/DocumentoGedipController');
  Route.resource('funcisresps', 'CtrlDisciplinar/FunciRespController');
  Route.resource('gedips', 'CtrlDisciplinar/GedipController');
  Route.get('gedipsconcluidos', 'CtrlDisciplinar/GedipController.gedipsConcluidos');
  Route.resource('medidas', 'CtrlDisciplinar/MedidaController');
  Route.resource('statusgedips', 'CtrlDisciplinar/StatusGedipController');
  Route.get('downdocs/', 'CtrlDisciplinar/DocumentoGedipController.showDown');
  Route.get('updocs/', 'CtrlDisciplinar/DocumentoGedipController.showUp');
  Route.get('in/', 'CtrlDisciplinar/InController.show');
  Route.get('resp/', 'CtrlDisciplinar/FunciRespController.findResp');
  Route.get('dtlmt/', 'CtrlDisciplinar/GedipController.getDataLimite');
  Route.get('teste/', 'CtrlDisciplinar/GedipController.teste');
  Route.get('bulkgedip/', 'CtrlDisciplinar/GedipController.getBulkGedip');
  Route.post('bulkgedip/', 'CtrlDisciplinar/GedipController.setBulkGedip');
  Route.get('migragedips/', 'CtrlDisciplinar/GedipController.migraGedips');
  Route.get('criaarquivos/', 'CtrlDisciplinar/GedipController.criaArquivos');
  Route.get('getprimgest/', 'CtrlDisciplinar/GedipController.getPrimGest');
  Route.get('getalineas/', 'CtrlDisciplinar/GedipController.getAlineas');
  Route.post('complementagedip/', 'CtrlDisciplinar/FunciRespController.complementaGedip');
}).prefix('/ctrldiscp').middleware(['isTokenValid', 'isDemandante']);