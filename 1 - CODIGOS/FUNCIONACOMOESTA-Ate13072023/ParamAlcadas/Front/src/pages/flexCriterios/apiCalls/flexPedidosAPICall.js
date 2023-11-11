import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getComplementosPendentes = async (
  idSolicitacao,
  analise = false,
) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/complementacao', {
    idSolicitacao,
    analise,
  });

export const getListaPedidos = async (filtro) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/solicitacoes', { filtro });
export const getPedido = async (id) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/detalhar', { id });
export const inserirPedidoFlex = async (dadosSolicitacao) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/novasolicitacao', {
    dadosSolicitacao,
  });
export const inserirManifestacao = async (manifestacao, idComplemento) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/manifestar', {
    manifestacao,
    idComplemento,
  });
export const inserirAnalise = async (analise) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/analisar', { analise });
export const inserirDespacho = async (despachar) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/despachar', { despachar });

export const inserirDeferimento = async (deferir) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/deferir', { deferir });
export const inserirFinalizacao = async (finalizar) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/finalizar', { finalizar });
