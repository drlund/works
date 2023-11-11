import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const aprovarMedidaLote = async (envolvidosParaAprovacao) =>
  fetch(FETCH_METHODS.POST, `/mtn/adm/envolvido/aprovar-medidas-lote`, {
    idsEnvolvidos: envolvidosParaAprovacao,
  });
