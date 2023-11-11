import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import apiModel from "services/apis/ApiModel";
import { ExtractErrorMessage } from "utils/Commons";

export const getPublicoAlvo = async (filtros) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/publico-alvo/`, { ...filtros });
};

export const fetchPermPgtoConta = async () => {
  return fetch(FETCH_METHODS.GET, `tarifas/perm-pgto-conta`);
};

export const getReservasPendentesConta = async () => {
  return fetch(FETCH_METHODS.GET, `tarifas/reservas/pendentes-pagamentos-conta`);
};
export const getReservasPendentesEspecie = async () => {
  return fetch(FETCH_METHODS.GET, `tarifas/reservas/pendentes-pagamentos-especie`);
};
export const fetchPendentesConfirmacaoPgto = async () => {
  return fetch(FETCH_METHODS.GET, `tarifas/pendentes-confirmacao-pgto`);
};
export const getFinalizadas = async () => {
  return fetch(FETCH_METHODS.GET, `tarifas/finalizadas`);
};

export const getDadosOcorrenciaReserva = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-reserva/${id}`);
};
export const getDadosOcorrenciaPgtoConta = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-pgto-conta/${id}`);
};
export const getDadosOcorrenciaPgtoEspecie = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-pgto-especie/${id}`);
};
export const getDadosOcorrenciaConfirmaPgto = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-confirma-pgto/${id}`);
};
export const getDadosOcorrenciaCancelar = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-confirma-pgto/${id}`);
};
export const getDadosOcorrenciaFinalizada = async (id) => {
  return fetch(FETCH_METHODS.GET, `/tarifas/ocorrencia-finalizada/${id}`);
};

export const cancelarRegistroPgto = async (observacao, idPagamento) => {
  return fetch(FETCH_METHODS.DELETE, `/tarifas/cancelar-pgto/${idPagamento}`, {
    observacao,
  });
};

export const confirmarPgto = async (observacao, idPagamento) => {
  return fetch(FETCH_METHODS.POST, `/tarifas/confirmacao-pgto/${idPagamento}`, {
    observacao,
  });
};

export const salvarReserva = async (reserva, idOcorrencia) => {
  return fetch(FETCH_METHODS.POST, `/tarifas/reserva/${idOcorrencia}`, reserva);
};

export const registrarPagamento = async (dadosPagamento, idOcorrencia) => {
  const { dataPagamento, observacoes, anexos } = dadosPagamento;

  try {
    var formData = new FormData();
    for (let arquivo of anexos) {
      formData.append("files", arquivo.originFileObj);
    }
    formData.append("idOcorrencia", idOcorrencia);
    formData.append("observacoes", observacoes);
    formData.append("dataPagamento", dataPagamento.format("YYYY-MM-DD"));
    await apiModel.post(`/tarifas/pagamento/${idOcorrencia}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data; boundary=500;",
      },
    });
  } catch (error) {
    throw ExtractErrorMessage(error);
  }
};

export const cancelarReserva = async (observacao, idReserva) => {
  return fetch(FETCH_METHODS.DELETE, `/tarifas/reserva/${idReserva}`, { observacao });
};
