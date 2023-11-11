// @ts-ignore
const Router = use("Route");

Router.group(() => {
  Router.get('/fluxos', "Procuracoes/MinutaController.getFluxosMinuta");
  Router.get('/fluxos/:id', "Procuracoes/MinutaController.getFluxosMinuta");

  Router.get('/regenerate', "Procuracoes/MinutaController.regenerateMinuta");
  Router.get('/regenerate/:id', "Procuracoes/MinutaController.regenerateMinuta");

  Router.get('/template', "Procuracoes/MinutaController.getMinutaTemplate");
  Router.get('/template/:id', "Procuracoes/MinutaController.getMinutaTemplate");

  Router.get('/', "Procuracoes/MinutaController.getMinuta");
  Router.get('/:id', "Procuracoes/MinutaController.getMinuta");

  Router.post('/', "Procuracoes/MinutaController.saveMinuta");
  Router.delete('/:id', "Procuracoes/MinutaController.softDeleteMinutaCadastrada");
})
  .prefix("/procuracoes/minutas")
  .middleware(["isTokenValid"]);
