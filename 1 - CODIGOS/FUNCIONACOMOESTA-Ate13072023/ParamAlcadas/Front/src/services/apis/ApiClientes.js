import apiModel from "services/apis/ApiModel";

/*******     Actions     *******/

/**
 *
 *  Recupera, do backend, dados básicos de um cliente, usando o MCI. os dados retornados são:
 *
 *      MCI,
 *      nomeCliente,
 *      dataNascimento,
 *      prefixoEncarteirado,
 *      nrCarteira,
 *      codTipoCarteira,
 *      nomeCarteira
 *
 * @param {params} mci MCI do cliente desejado
 */

const fetchDadosCliente = async (mci, incluirClassificacao = false) => {
  try {
    if (!mci || mci === "") {
      return new Promise((resolve, reject) =>
        reject("Campo MCI é de preenchimento obrigatório")
      );
    }

    if (mci.length > 9) {
      return new Promise((resolve, reject) => reject("MCI Inválido"));
    }

    let response = await apiModel.get(
      `/encantar/solicitacao/dados-cliente/${mci}`,
      incluirClassificacao ? { params: { incluirClassificacao } } : null
    );
    let dadosCliente = response.data;
    return new Promise((resolve, reject) => resolve(dadosCliente));
  } catch (error) {
    let msg =
      "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
    if (error.response.status === 404) {
      msg = "Cliente não encontrado";
    }
    return new Promise((resolve, reject) => reject(msg));
  }
};

export { fetchDadosCliente };
