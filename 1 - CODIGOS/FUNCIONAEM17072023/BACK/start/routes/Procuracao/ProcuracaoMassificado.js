// @ts-ignore
const Router = use("Route");

Router.group(() => {
  Router.post('/listaOutorgados', "Procuracoes/MassificadoController.getListaOutorgados");
  Router.delete('/listaMinutas', "Procuracoes/MassificadoController.deleteManyMinutasMassificado");
})
  .prefix("/procuracoes/massificado")
  .middleware(["isTokenValid"]);

Router.group(() => {
  Router.get('/', "Procuracoes/MassificadoController.getListaMinutasMassificado");
  Router.post('/finalizar', "Procuracoes/MassificadoController.postFinalizarMinuta");

  Router.get('/regenerate', "Procuracoes/MassificadoController.regenerateMassificado");
  Router.get('/regenerate/:id', "Procuracoes/MassificadoController.regenerateMassificado");

})
  .prefix("/procuracoes/massificado/minuta")
  .middleware(["isTokenValid"]);
