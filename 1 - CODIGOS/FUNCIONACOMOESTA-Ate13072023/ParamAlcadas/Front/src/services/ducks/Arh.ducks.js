/* eslint-disable no-promise-executor-return */
// @ts-nocheck
/**
 * DUCK utilitario para actions que retornam dados gerais de funcis e dependencias.
 *
 */
import apiModel from "services/apis/ApiModel";
import { getProfileURL, ExtractErrorMessage } from "utils/Commons";
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const fetchFunci = (matricula) => async () => {
  if (!matricula.length) {
    return new Promise((resolve, reject) => reject("Matrícula não informada!"));
  }

  try {
    const response = await apiModel.get(`/funci/${matricula}`);
    const responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) => reject('Nenhum registro encontrado para a matrícula informada.'));
    }

    const dadosFunci = {
      key: responseData.matricula,
      matricula: responseData.matricula,
      nome: responseData.nome,
      nomeGuerra: responseData.nomeGuerra,
      cargo: responseData.descCargo,
      img: getProfileURL(responseData.matricula),
      prefixo: responseData.dependencia.prefixo,
      nomeDependencia: responseData.dependencia.nome,
    };

    return new Promise((resolve) => {
      resolve({ ...dadosFunci });
    });
  } catch (error) {
    const msg = ExtractErrorMessage(
      error,
      'Falha ao obter os dados para a matrícula informada.'
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchFunciForaRedux = async (matricula) => {
  if (!matricula.length) {
    return new Promise((resolve, reject) => reject("Matrícula não informada!"));
  }

  try {
    const response = await apiModel.get(`/funci/${matricula}`);
    const responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) =>
        reject("Nenhum registro encontrado para a matrícula informada.")
      );
    }

    const dadosFunci = {
      key: responseData.matricula,
      matricula: responseData.matricula,
      nome: responseData.nome,
      nomeGuerra: responseData.nomeGuerra,
      cargo: responseData.descCargo,
      img: getProfileURL(responseData.matricula),
      prefixo: responseData.dependencia.prefixo,
      nomeDependencia: responseData.dependencia.nome,
    };

    return new Promise((resolve) => {
      resolve({ ...dadosFunci });
    });
  } catch (error) {
    const msg = ExtractErrorMessage(
      error,
      "Falha ao obter os dados para a matrícula informada."
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchDependencia = (prefixo) => async () => {
  if (!prefixo) {
    return new Promise((resolve, reject) =>
      reject("Dependencia não informada!")
    );
  }

  try {
    const response = await apiModel.get(`/dependencia/${prefixo}`);
    const dependencia = response.data;

    if (!dependencia) {
      return new Promise((resolve, reject) =>
        reject("Nenhum registro encontrado para o prefixo informado.")
      );
    }

    dependencia.key = dependencia.prefixo;
    return new Promise((resolve) => {
      resolve({ ...dependencia });
    });
  } catch (error) {
    const msg = ExtractErrorMessage(
      error,
      "Falha ao obter os dados da dependencia informada!"
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

/**
 * Obtem a lista dos comites atuais de um prefixo.
 * @param {*} prefixo
 * @param {*} responseHandler
 */
export const fetchListaComites = (prefixo) => async () => {
  if (!prefixo) {
    return new Promise((resolve, reject) =>
      reject("Dependencia não informada!")
    );
  }

  try {
    const response = await apiModel.get("/comites", { params: { prefixo } });
    const listaComites = response.data;
    return new Promise((resolve) => {
      resolve([...listaComites]);
    });
  } catch (error) {
    const msg = ExtractErrorMessage(error, "Falha ao obter a lista de comitês!");
    return new Promise((resolve, reject) => reject(msg));
  }
};

/**
 * Obtem a lista de membros do comite de um prefixo.
 * @param {*} prefixo
 * @param {*} codigoComite
 * @param {*} responseHandler
 */
export const fetchMembrosComite = (prefixo, codigoComite) => async () => {
  if (!prefixo) {
    return new Promise((resolve, reject) =>
      reject("Dependencia não informada!")
    );
  }

  if (!codigoComite) {
    return new Promise((resolve, reject) =>
      reject("Necessário o código do comitê!")
    );
  }

  try {
    const response = await apiModel.get("/membros-comite", {
      params: { prefixo, codigoComite },
    });
    const membrosComites = response.data;
    return new Promise((resolve) => {
      resolve([...membrosComites]);
    });
  } catch (error) {
    const msg = ExtractErrorMessage(
      error,
      "Falha ao obter a lista de membros dete comitê!"
    );
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchMatchedPrefixos = (prefixo) => async () => {
  try {
    const response = await apiModel.get("/matcheddependencias/", {
      params: { prefixo },
    });

    const responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) =>
        reject("Nenhum registro encontrado para os dados informados.")
      );
    }

    return new Promise((resolve) => {
      resolve(responseData);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject("Falha ao obter os dados dos prefixos.")
    );
  }
};

export const fetchFuncisLotados = (prefixo, comissao) => async () => {
  try {
    const response = await apiModel.get("/funcislotados/", {
      params: {
        prefixo,
        comissao,
      },
    });

    const responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) =>
        reject("Nenhum registro encontrado para os dados informados.")
      );
    }

    return new Promise((resolve) => {
      resolve(responseData);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject("Falha ao obter os dados dos funcionários lotados.")
    );
  }
};

export const fetchFuncis =
  (funci, buscaSimplificada = false, cancelToken = null) =>
  async () => {
    try {
      const cancelParam = cancelToken ? { cancelToken } : {};
      let requestParams = {};

      if (buscaSimplificada) {
        requestParams = { buscaSimplificada: true };
      }

      const response = await apiModel.get("/matchedfuncis", {
        params: {
          funci,
          ...requestParams,
        },
        ...cancelParam,
      });

      const responseData = response.data;

      if (!responseData) {
        return new Promise((resolve, reject) =>
          reject("Nenhum registro encontrado para os dados informados.")
        );
      }

      return new Promise((resolve) => {
        resolve(responseData);
      });
    } catch (error) {
      if (cancelToken) {
        return new Promise((resolve, reject) => reject(error));
      }

      return new Promise((resolve, reject) =>
        reject("Falha ao obter os dados dos funcionários.")
      );
    }
  };

// método que retorna um Promise resolvido. Envia direto para o componente que chamou - usar direto com o this.setState()
export const fetchDotacao = (prefixo, ger, gest) => async () => {
  try {
    const response = await apiModel.get("/dotacao/", {
      params: {
        prefixo,
        ger: !!ger,
        gest: !!gest,
      },
    });

    const responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) =>
        reject("Nenhum registro encontrado para os dados informados.")
      );
    }

    return new Promise((resolve) => {
      resolve(responseData);
    });
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject("Falha ao obter os dados da dotação do prefixo.")
    );
  }
};

export const fetchPrefixosAndSubords =
  (prefixo, cancelToken = null) =>
  async () => {
    try {
      const cancelParam = cancelToken ? { cancelToken } : {};

      const response = await apiModel.get("/depesubord/", {
        params: {
          prefixo,
        },
        ...cancelParam,
      });

      const responseData = response.data;

      if (!responseData) {
        return new Promise((resolve, reject) =>
          reject("Nenhum registro encontrado para os dados informados.")
        );
      }

      return new Promise((resolve) => {
        resolve(responseData);
      });
    } catch (error) {
      return new Promise((resolve, reject) =>
        reject("Falha ao obter os dados dos prefixos.")
      );
    }
  };

export const fetchListaComissoes = (prefixo) => async () => {
  if (!prefixo) {
    return new Promise((resolve, reject) =>
      reject("Prefixo não informado!")
    );
  }

  try {
    const response = await apiModel.get("/comissoes", { params: { prefixo } });
    const listaComissoes = response.data;
    return new Promise((resolve) => {
      resolve([...listaComissoes]);
    });
  } catch (error) {
    const msg = ExtractErrorMessage(error, "Falha ao obter a lista de comissões!");
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchIsNivelGerencial = async () => fetch(FETCH_METHODS.GET, `/funci/checa-funcao-gerencial/`);