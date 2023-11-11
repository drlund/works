/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group( () => {
  Route.get('/', 'ProjetosController.getListaProjetos');
  Route.get('/listaAtividades', 'ProjetosController.getListaAtividadesByFunci');
  Route.patch('/alterarAtividade', 'ProjetosController.patchAtividade');
  Route.get('/atividade', 'ProjetosController.getAtividade');
  Route.get('/buscarProjeto', 'ProjetosController.getProjeto');
  Route.post('/gravarProjeto', 'ProjetosController.postProjeto');
  Route.post('/gravarEsclarecimento', 'ProjetosController.postEsclarecimento');
  Route.post('/gravarPausa', 'ProjetosController.postPausa');
  Route.patch('/updateEsclarecimento', 'ProjetosController.patchEsclarecimento');
  Route.patch('/alterarProjeto', 'ProjetosController.patchProjeto');
  Route.patch('/excluirProjeto', 'ProjetosController.deleteProjeto');
}).prefix('/projetos').middleware(['isTokenValid', 'allowed:OR,Projetos,USUARIO']);