/* eslint-disable camelcase */
// @ts-nocheck

import { message } from 'antd';
import { FETCH_METHODS, fetch} from 'services/apis/GenericFetch';

export const getParametros = async (id) => fetch(FETCH_METHODS.GET, '/movimentacoes/testa-parametros/',  { id } );
export const delParametro = async (id) => fetch(FETCH_METHODS.DELETE, '/movimentacoes/exclui-parametro/',   id  ).then(() => message.success('Parametro excluído com sucesso!'));
export const gravarParametro = async (novoParametro) => fetch(FETCH_METHODS.POST, '/movimentacoes/gravarParametro', novoParametro).then(() => message.success('Parametro gravado com sucesso!'));
export const patchParametros = async (id) => fetch(FETCH_METHODS.PATCH, 'movimentacoes/patchParametros', id).then(() => message.success('Comitê alterado com sucesso!'));
export const getCargosComissoesFot09 = async (cod_dependencia) => fetch(FETCH_METHODS.GET, '/movimentacoes/getCargosComissoesFot09/',  { cod_dependencia } );
export const getJurisdicoesSubordinadas = async (prefixo) => fetch(FETCH_METHODS.GET, '/movimentacoes/getJurisdicoesSubordinadas/',  { prefixo } );
export const listaComiteParamAlcadas = async (prefixo) => fetch(FETCH_METHODS.GET, '/movimentacoes/listaComiteParamAlcadas/',  { prefixo } );
export const verificarStatusParametro = async (prefixoDestino, comissaoDestino) => fetch(FETCH_METHODS.GET, '/movimentacoes/verificarStatusParametro/',  {prefixoDestino, comissaoDestino  } );
export const atualizarStatusParametro = async (prefixoDestino, comissaoDestino) => fetch(FETCH_METHODS.GET, '/movimentacoes/atualizarStatusParametro/',  { prefixoDestino, comissaoDestino } );
