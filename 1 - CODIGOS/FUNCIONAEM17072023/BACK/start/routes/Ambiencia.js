const Route = use('Route');
Route.group( () => {
  Route.get('/prefixo-avaliavel', 'AmbienciaController.getPrefixoAvaliavel');
  Route.get('/campanhas', 'AmbienciaController.getCampanhas');
  Route.post('/registrar-avaliacao', 'AmbienciaController.registrarAvaliacao');
})
.prefix('/ambiencia')
.middleware(['isTokenValid']);

Route.get('/ambiencia/api-imagem-ambiencia', 'AmbienciaController.getImagemApi');