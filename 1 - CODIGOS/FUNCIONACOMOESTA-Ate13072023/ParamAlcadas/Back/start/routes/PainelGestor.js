/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('indicadores', 'PainelGestorController.getIndicadores');
  Route.get('lista-prefixos', 'PainelGestorController.getListaPrefixos');
  Route.get('lista-subordinadas', 'PainelGestorController.getSubordinadasByPrefixo');
  Route.get('acesso', 'PainelGestorController.verificaAcesso');
}).prefix('/painel').middleware(['isTokenValid']);