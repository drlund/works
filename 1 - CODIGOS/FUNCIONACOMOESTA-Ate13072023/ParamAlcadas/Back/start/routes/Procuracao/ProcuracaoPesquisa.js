// @ts-ignore
const Router = use("Route");

Router.group(() => {
  Router.get('/', "Procuracoes/PesquisaController.getProcuracao");
  Router.post('/', "Procuracoes/PesquisaController.pesquisaProcuracao");
})
  .prefix("/procuracoes/pesquisa")
  .middleware(["isTokenValid"]);
