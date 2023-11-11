import { message } from 'antd';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getSuspensoes = async (/** @type {number} */ id) =>
  fetch(FETCH_METHODS.GET, '/movimentacoes/getSuspensoes/', { id });


  