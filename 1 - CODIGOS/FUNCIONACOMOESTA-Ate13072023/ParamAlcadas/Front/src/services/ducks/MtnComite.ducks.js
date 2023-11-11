import apiModel from "services/apis/ApiModel";

import { DownloadFileUtil } from "utils/Commons";
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import constants from "utils/Constants";

const { MTN_COMITE } = constants;
const { ACOES_VOTO, ACOES_TRATAR_ALTERACAO } = MTN_COMITE;
const { APROVAR, ALTERAR } = ACOES_VOTO;

const ARRAY_ACOES_VOTOS = [APROVAR, ALTERAR];

export const fetchMonitoramentosParaNovaVersao= () => {
  return fetch(FETCH_METHODS.GET, "mtn/monitoramentos/para-nova-versao");
};

export const fetchMonitoramentosEmVotacao = () => {
  return fetch(FETCH_METHODS.GET, "mtn/monitoramentos/em-votacao");
};

export const excluirVotacao = (idMonitoramento) => {
  return fetch(FETCH_METHODS.DELETE, `mtn/monitoramentos/votacao/${idMonitoramento}`);
};

export const fetchDadosMonitoramento = (idMonitoramento) => {
  return fetch(FETCH_METHODS.GET, `mtn/monitoramentos/${idMonitoramento}`);
};

export const fetchMonitoramentoParaVotacao = (idMonitoramento) => {
  return fetch(FETCH_METHODS.GET, `mtn/monitoramentos/para-votacao/${idMonitoramento}`);
};

export const salvarMonitoramento = (dadosMonitoramento) => {
  return fetch(
    FETCH_METHODS.POST,
    "mtn/monitoramentos/incluir-monitoramento",
    dadosMonitoramento
  );
};

export const incluirVersaoMonitoramento = async (
  idMonitoramento,
  dadosNovosParamentos
) => {
  return new Promise(async (resolve, reject) => {
    const { motivacao, documento, anexos, tipoVotacao } = dadosNovosParamentos;
    try {
      const formData = new FormData();
      if (Array.isArray(anexos) && anexos.length > 0) {
        for (const anexo of anexos) {
          formData.append("anexos[]", anexo.originFileObj);
        }
      }

      formData.append("documento", documento);
      formData.append("motivacao", motivacao);
      formData.append("tipoVotacao", tipoVotacao);

      await apiModel.post(
        `/mtn/monitoramentos/incluir-parametros-monitoramento/${idMonitoramento}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );
      resolve();
    } catch (error) {
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const downloadDocumentoParametro = async (
  idDocumento,
  hash,
  callBack
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${process.env.REACT_APP_ENDPOINT_API_URL}/mtn/monitoramentos/download-documento/${idDocumento}/${hash}`;
      let response = await apiModel.get(url, {
        responseType: "blob",
      });
      DownloadFileUtil("documento_parametros.pdf", response.data);
      resolve();
    } catch (error) {
      let what =
        error.response && error.response.data ? error.response.data : null;

      reject(what);
    }
  });
};

export const salvarTratamentoPedidoAlteracao = (
  idParametro,
  dadosTratamento
) => {
  return new Promise(async (resolve, reject) => {
    const { acao, justificativa, documento } = dadosTratamento;
    try {
      if (!acao) {
        reject("Ação é obrigatória.");
      }

      if (
        ![
          ACOES_TRATAR_ALTERACAO.ACEITAR,
          ACOES_TRATAR_ALTERACAO.RECUSAR,
        ].includes(acao)
      ) {
        reject("Tratamento inválido!");
        return;
      }

      if (!justificativa) {
        reject("Justificativa é obrigatória");
        return;
      }

      if (acao === ACOES_TRATAR_ALTERACAO.ACEITAR && !documento) {
        reject(
          "Quando aprovar o o pedido de alteração, a inclusão de documento é obrigatório."
        );
        return;
      }

      const formData = new FormData();
      if (acao === ACOES_TRATAR_ALTERACAO.ACEITAR && documento) {
        formData.append("documento", documento);
      }

      formData.append("acao", acao);
      formData.append("justificativa", justificativa);
      await apiModel.post(
        `mtn/monitoramentos/tratar-alteracao/${idParametro}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );
      resolve();
    } catch (error) {
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const votar = async (idMonitoramento, dadosVoto) => {
  return new Promise(async (resolve, reject) => {
    const { tipoVoto, justificativa, anexos } = dadosVoto;

    if (!ARRAY_ACOES_VOTOS.includes(tipoVoto)) {
      reject("Tipo de voto inválido.");
    }

    try {
      const formData = new FormData();
      if (Array.isArray(anexos) && anexos.length > 0) {
        for (const anexo of anexos) {
          formData.append("anexos[]", anexo.originFileObj);
        }
      }

      formData.append("tipoVoto", tipoVoto);
      formData.append("justificativa", justificativa);

      await apiModel.post(
        `/mtn/monitoramentos/votar-parametro/${idMonitoramento}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );
      resolve();
    } catch (error) {
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const fetchPermVotar = async () => {
  return fetch(FETCH_METHODS.GET, `mtn/monitoramentos/pode-visualizar-votacoes`);
};

export const fetchAlteracoesParaTratamento = async () => {
  return fetch(FETCH_METHODS.GET, `mtn/monitoramentos/alteracoes-para-tratamento`);
};

export const fetchMonitoramentoParaAlteracao = async (idMonitoramento) => {
  return fetch(
    FETCH_METHODS.GET,
    `mtn/monitoramentos/parametro/para-alteracao/${idMonitoramento}`
  );
};

/**
 *
 *  Recupera os monitoramentos que estão em votação e o usuário
 *  logado tem autorização para votar.
 *
 */

export const getVotacoesUsuario = async () => {
  return fetch(FETCH_METHODS.GET, `mtn/monitoramentos/para-votacao`);
};
