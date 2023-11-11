const Route = use('Route');
Route.group(() => {
  Route.get('/video', 'CarrosselController.getVideo');
}).prefix('/carrossel');
Route.group(() => {
  Route.get('/videos', 'CarrosselController.getVideos');
  Route.post('/postVideo', 'CarrosselController.postVideo');
  Route.post('/uploadVideo', 'CarrosselController.uploadVideo');
  Route.post('/deleteVideo', 'CarrosselController.deleteVideo');
  Route.post('/updateVideo', 'CarrosselController.updateVideo');
}).prefix('/carrossel').middleware(['isTokenValid']);

