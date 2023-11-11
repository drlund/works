import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const fetchVideo = () => fetch(FETCH_METHODS.GET, '/carrossel/video');
export const fetchVideos = () => fetch(FETCH_METHODS.GET, '/carrossel/videos');

export const postVideo = async (dadosForm) => {
  const { dataInicioReproducao, video } = dadosForm;
  const formData = new FormData();
  formData.append('file', video.file.originFileObj);
  formData.append('dataInicioReproducao', new Date(dataInicioReproducao));

  return fetch(
    FETCH_METHODS.POST,
    'carrossel/postVideo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    }
  );

};

export const deleteVideo = async (video) => {
  const { id } = video;
  return fetch(FETCH_METHODS.POST, '/carrossel/deleteVideo', { id });
};

export const updateVideo = async (dados) => {
  const { id, novaDataInicioReproducao } = dados;
  return fetch(FETCH_METHODS.POST, '/carrossel/updateVideo', { id, novaDataInicioReproducao });
};
