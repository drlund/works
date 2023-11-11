import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getFerramentas = async () =>
  fetch(FETCH_METHODS.GET, 'gerenciador-ferramentas');

export const patchFerramenta = async (ferramenta) =>
  fetch(FETCH_METHODS.PATCH, 'gerenciador-ferramentas', { ferramenta });

export const postFerramenta = async (ferramenta) =>
  fetch(FETCH_METHODS.POST, 'gerenciador-ferramentas', { ferramenta });
