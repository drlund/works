// @ts-ignore
const Router = use("Route");

Router.group(() => {
  Router.get('/acessos', "Procuracoes/GerenciarController.getPrefixosAcessoGerenciar");
  Router.post('/manifesto', "Procuracoes/GerenciarController.postManifesto");
  Router.post('/copia-autenticada', "Procuracoes/GerenciarController.postCopiaAutenticada");
  Router.post('/revogacao', "Procuracoes/GerenciarController.postRevogacao");
})
  .prefix("/procuracoes/gerenciar")
  .middleware(["isTokenValid"]);
