/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const ACESSOS_COMMON_MIDDLEWARE = ['isTokenValid', 'isGestorAcessos'];
Route.get('/acessos/ferramentas', 'AcessoController.findListaFerramentas').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.post('/acessos/ferramentas', 'AcessoController.saveFerramenta').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.patch('/acessos/ferramentas', 'AcessoController.saveFerramenta').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.get('/acessos/concessoes', 'AcessoController.findListaConcessoes').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.get('/acessos/tipos', 'AcessoController.findTiposAcesso').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.post('/acessos/concessoes', 'AcessoController.saveConcessaoAcesso').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.patch('/acessos/concessoes', 'AcessoController.saveConcessaoAcesso').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.delete('/acessos/concessoes/:id', 'AcessoController.deleteConcessaoAcesso').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.delete('/acessos/ferramentas/:id', 'AcessoController.deleteFerramenta').middleware([...ACESSOS_COMMON_MIDDLEWARE]);
Route.get('/acessos/permissoes', 'AcessoController.findPermissoesUsuario').middleware(['isTokenValid']);
Route.get('/acessos/removerAutomatico', 'AcessoController.revogarAcessosAutomaticamente');
Route.get('/acessos/findMatriculasEPrefixos', 'AcessoController.findMatriculasEPrefixos');