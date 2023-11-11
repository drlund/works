import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const fetchCanais = () => fetch(FETCH_METHODS.GET, '/podcasts/canais');
export const fetchCanaisAtivosBySeguidor = () => fetch(FETCH_METHODS.GET, '/podcasts/canaisAtivos');
export const getCanal = async (id) => fetch(FETCH_METHODS.GET, '/podcasts/canal', {id});
export const fetchEpisodios = () => fetch(FETCH_METHODS.GET, '/podcasts/episodios');
export const fetchTags = () => fetch(FETCH_METHODS.GET, '/podcasts/tags');
export const fetchCanaisSeguidos = () => fetch(FETCH_METHODS.GET, '/podcasts/seguidores/seguidor');
export const fetchCanaisAtivosInativosBySeguidor = () => fetch(FETCH_METHODS.GET, '/podcasts/seguidores/canaisAtivosInativos');

/** @typedef {Podcasts.Episodio} Episodio */
/** @typedef {Podcasts.Canal} Canal */
/** @typedef {Podcasts.Seguidor} Seguidor */

export const postCanal = async (dadosForm) => {
  const { nome, descricao, imagem } = dadosForm;
  const formData = new FormData();
  formData.append('file', imagem.file.originFileObj);
  formData.append('nome', nome);
  formData.append('descricao', descricao);

  return fetch(
    FETCH_METHODS.POST,
    'podcasts/gerenciar/postCanal',   
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    }
  );
};

export const updateCanal = async (dadosForm) => {
  const { id, novoNome, novaDescricao } = dadosForm;
  return fetch(FETCH_METHODS.POST, 'podcasts/gerenciar/updateCanal', { id, novoNome, novaDescricao });
};

export const updateCapaCanal = async (dadosForm) => {
  const { id, novaImagem } = dadosForm;
  const formData = new FormData();
  formData.append('id', id);
  formData.append('file', novaImagem.file.originFileObj);

  return fetch(
    FETCH_METHODS.POST,
    'podcasts/gerenciar/updateCapaCanal',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    }
  );
};

export const deleteCanal = async (/** @type {Canal} */canal) => {
  const { id } = canal;
  return fetch(FETCH_METHODS.POST, 'podcasts/gerenciar/deleteCanal', { id });
};

export const deleteSeguidor = async (/** @type {Seguidor} */seguidor) => {
  const { id } = seguidor;
  return fetch(FETCH_METHODS.POST, '/podcasts/seguidores/deleteSeguidor', { id });
};

export const postEpisodio = async (dadosForm) => {
  const { nomeEpisodio, idCanal, tags, videoEpisodio } = dadosForm;
  const formData = new FormData();
  formData.append('nomeEpisodio', nomeEpisodio);
  formData.append('idCanal', idCanal);
  formData.append('tags', JSON.stringify(tags));
  formData.append('file', videoEpisodio.file.originFileObj);

  return fetch(
    FETCH_METHODS.POST,
    'podcasts/episodios/postEpisodio',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=500;',
      },
    }
  );
};

export const toggleCurtir = async (idEpisodio) => fetch(FETCH_METHODS.POST, 'podcasts/episodios/toggleCurtir', { idEpisodio });

export const switchSeguirCanal = async (idCanal) => fetch(FETCH_METHODS.POST, `podcasts/seguidores/seguirCanal?idCanal=${idCanal}` );

export const deleteEpisodio = async (/** @type {Episodio} */episodio) => {
  const { id } = episodio;
  return fetch(FETCH_METHODS.POST, 'podcasts/episodios/deleteEpisodio', { id });
};