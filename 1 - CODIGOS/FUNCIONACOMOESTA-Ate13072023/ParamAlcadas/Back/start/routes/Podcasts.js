const Route = use('Route');

Route.group(() => {
  Route.get('/episodios', 'Podcasts/EpisodiosController.getEpisodios');
  Route.get('/likesEpisodios', 'Podcasts/EpisodiosController.getLikesEpisodios');
  Route.get('/tags', 'Podcasts/TagsController.getTags');
  Route.get('/canais', 'Podcasts/CanaisController.getCanais');
}).prefix('/podcasts');

Route.group(() => {
  Route.get('/', 'Podcasts/CanaisController.getCanalById');
  Route.get('/:id', 'Podcasts/CanaisController.getCanalById');
}).prefix('/podcasts/canal');

Route.group(() => {
  Route.get('/:id', 'Podcasts/EpisodiosController.getEpisodioById');
  Route.get('/', 'Podcasts/EpisodiosController.getEpisodioById');
}).prefix('/podcasts/episodio');

Route.group(() => {
  Route.post('/episodios/toggleCurtir', 'Podcasts/EpisodiosController.toggleCurtir');
}).prefix('/podcasts').middleware(['isTokenValid']);

Route.group(() => {
  Route.post('/postCanal', 'Podcasts/CanaisController.postCanal');
  Route.post('/deleteCanal', 'Podcasts/CanaisController.deleteCanal');
  Route.post('/updateCanal', 'Podcasts/CanaisController.updateCanal');
  Route.post('/updateCapaCanal', 'Podcasts/CanaisController.updateCapaCanal');
}).prefix('/podcasts/gerenciar').middleware(['isTokenValid']);

Route.group(() => {
  Route.post('/postEpisodio', 'Podcasts/EpisodiosController.postEpisodio');
  Route.post('/deleteEpisodio', 'Podcasts/EpisodiosController.deleteEpisodio');
  Route.post('/updateEpisodio', 'Podcasts/EpisodiosController.updateEpisodio');
}).prefix('/podcasts/episodios').middleware(['isTokenValid']);

Route.group(() => {
  Route.post('/deleteTag', 'Podcasts/TagsController.deleteTag');
}).prefix('/podcasts/tags').middleware(['isTokenValid']);
