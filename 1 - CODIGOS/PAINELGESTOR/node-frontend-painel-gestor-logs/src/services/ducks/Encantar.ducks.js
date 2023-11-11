import apiModel from "services/apis/ApiModel";
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import moment from "moment";
import { DownloadFileUtil } from "utils/Commons";
//import _ from "lodash";

/*******     Constants     *******/

/*******     Action Types     *******/

export const types = {};

/*******     Estado Inicial     *******/

const initialState = {};

/*******     Reducers     *******/

export default (state = initialState, action) => {
  //let newState = _.cloneDeep(state);

  switch (action.type) {
    default:
      return state;
  }
};

/*******     Actions     *******/

/*** Chamadas de API ***/

export const fetchBrindesPorGestores = (
  prefixosGestores,
  classificacaoCliente
) => {
  return fetch(FETCH_METHODS.GET, "/encantar/brindes-por-gestor", {
    prefixos: prefixosGestores,
    classificacao: classificacaoCliente,
  });
};

export const fetchSolicitacoesAndamento = ({
  statusSolicitacao,
  somenteMeuPrefixo,
}) => {
  return fetch(FETCH_METHODS.GET, "/encantar/solicitacoes-andamento/", {
    statusSolicitacao,
    somenteMeuPrefixo,
  });
};

export const fetchSolicitacoesMeusPrefixos = () => {
  return fetch(FETCH_METHODS.GET, "/encantar/solicitacoes-meu-prefixo/");
};

export const fetchSolicitacao = async (idSolicitacao) => {
  try {
    let response = await apiModel.get(`/encantar/solicitacao/${idSolicitacao}`);
    let solicitacao = response.data;
    return new Promise((resolve, reject) => resolve(solicitacao));
  } catch (error) {
    return new Promise((resolve, reject) => reject(error));
  }
};

export const fetchSolicitacaoParaReacao = async (idSolicitacao) => {
  try {
    let response = await apiModel.get(
      `/encantar/solicitacao/para-reacao/${idSolicitacao}`
    );
    let solicitacao = response.data;
    return new Promise((resolve, reject) => resolve(solicitacao));
  } catch (error) {
    return new Promise((resolve, reject) => reject(error));
  }
};

export const fetchSolicitacoesFinalizadas = async () => {
  try {
    let response = await apiModel.get(`/encantar/solicitacoes-finalizadas/`);
    let solicitacoesPendentes = response.data;
    return new Promise((resolve, reject) => resolve(solicitacoesPendentes));
  } catch (error) {
    return new Promise((resolve, reject) =>
      reject("Não foi possível obter a lista de solicitacoes finalizadas.")
    );
  }
};

/**
 *
 *  Recupera o status da capacitação do usuário para poder utilizar a ferramenta.
 *  Ele poderá utilizar a mesma caso todos os vídeos e cursos tenham sido finalizados ou ele seja isento.
 *
 */

export const fetchCapacitacao = async () => {
  return fetch(FETCH_METHODS.GET, "/encantar/solicitacao/verifica-capacitacao");
};

export const fetchSolicitacaoAprovacao = async (idSolicitacao) => {
  return fetch(
    FETCH_METHODS.GET,
    `/encantar/solicitacao/aprovacao/${idSolicitacao}`,
    {},
    {},
    true
  );
};

export const fetchSolicitacoesParaAprovacao = async (tipo) => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/pendencias-aprovacao/${tipo}`);
};

export const fetchSolicitacoesAprovacaoFinalizada = async (filtros) => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/aprovacoes-finalizada`, filtros);
};

export const fetchSolicitacoesPendentesEnvio = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/pendentes-para-envio`);
};

export const fetchSolicitacoesPendentesEntrega = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/pendentes-para-entrega`);
};

export const fetchSolicitacoesParaReacao = async (filtros) => {
  const filtrosTratados = {};
  for (const filtro of Object.keys(filtros)) {
    if (filtros[filtro]) {
      filtrosTratados[filtro] = filtros[filtro];
    }
  }
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/pendentes-para-reacao`, {
    filtros: filtrosTratados,
  });
};

export const fetchPermRegistroReacao = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/perm-reacao/`);
};
export const fetchPermIncluirSolicitacao = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/perm-incluir-solicitacao/`);
};

export const verificaExisteSolicitacao = async (idSolicitacao) => {
  return fetch(
    "get",
    `/encantar/solicitacao/validar-existencia/${idSolicitacao}`
  );
};

export const fetchSolicitacoesPendentesRecebimento = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/pendentes-recebimento-prefixo`);
};

export const podeIncluirSolicitacao = async () => {
  return fetch(FETCH_METHODS.GET, "/encantar/solicitacao/pode-incluir");
};

export const fetchGestoresBrinde = async (prefixoFato) => {
  return fetch(FETCH_METHODS.GET, `/encantar/estoques/${prefixoFato}`);
};

export const finalizouVideo = async (idVideo) => {
  return fetch(FETCH_METHODS.POST, `/encantar/capacitacao/visualizou-video/${idVideo}`);
};

export const downloadAnexo = async (idAnexo, fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await apiModel.get("/encantar/download-anexo/" + idAnexo, {
        responseType: "blob",
      });
      DownloadFileUtil(fileName, response.data);
      resolve();
    } catch (error) {
      let what =
        error.response && error.response.data ? error.response.data : null;

      reject(what);
    }
  });
};

export const salvarLocalEntregaEditado = async (
  idSolicitacao,
  dadosLocalEntrega
) => {
  return fetch(
    "post",
    `/encantar/solicitacao/entrega/${idSolicitacao}`,
    dadosLocalEntrega
  );
};

export const salvarRegistroEntregaCliente = async (
  dadosEntrega,
  idSolicitacao
) => {
  const {
    resultadoEntregaCliente,
    informacoes,
    anexos,
    dataResultadoEntrega,
  } = dadosEntrega;

  return new Promise(async (resolve, reject) => {
    if (!resultadoEntregaCliente) {
      reject("Resultado da entrega é obrigatório");
      return;
    }

    try {
      var formData = new FormData();

      formData.append("resultadoEntregaCliente", resultadoEntregaCliente);
      formData.append("informacoes", informacoes);
      formData.append(
        "dataResultadoEntrega",
        moment(dataResultadoEntrega).format("YYYY-MM-DD HH:mm")
      );

      if (anexos) {
        if (anexos.fileList) {
          for (let anexo of anexos.fileList) {
            formData.append("files", anexo.originFileObj);
          }
        }
      }

      await apiModel.post(
        `/encantar/solicitacao/registrar-entrega-cliente/${idSolicitacao}`,
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

export const salvarCancelamento = async ({
  justificativa,
  idSolicitacao,
  anexos,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      var formData = new FormData();
      formData.append("justificativa", justificativa);

      if (anexos) {
        for (let anexo of anexos) {
          formData.append("files", anexo.originFileObj);
        }
      }

      await apiModel.post(
        `/encantar/solicitacao/cancelar/${idSolicitacao}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );

      resolve();
    } catch (error) {
      reject(error.response.data);
    }
  });
};

export const fetchSolicitacoesDevolvidas = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/devolvidas/`);
};

export const fetchMinhasSolicitacoes = async (periodoSolicitacao) => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacao/reacao/minhas-solicitacoes/`, {
    periodoSolicitacao,
  });
};

export const registrarTratamentoDevolucao = async (
  dadosDevolucao,
  idSolicitacao
) => {
  const {
    tratamentoDevolucao,
    informacoesTratamentoDevolucao,
    anexos,
  } = dadosDevolucao;

  return new Promise(async (resolve, reject) => {
    if (!tratamentoDevolucao) {
      reject("Campo data envio é obrigatório");
      return;
    }

    if (!informacoesTratamentoDevolucao) {
      reject("Campo tipo da entrega é obrigatório");
      return;
    }

    try {
      var formData = new FormData();
      formData.append("tratamentoDevolucao", tratamentoDevolucao);
      formData.append(
        "informacoesTratamentoDevolucao",
        informacoesTratamentoDevolucao
      );
      if (anexos) {
        if (anexos.fileList) {
          for (let anexo of anexos.fileList) {
            formData.append("files", anexo.originFileObj);
          }
        }
      }

      await apiModel.post(
        `/encantar/solicitacao/tratar-devolucao/${idSolicitacao}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );

      resolve();
    } catch (error) {
      console.log(error);
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const salvarReacaoSolicitacao = async (dadosReacao, idSolicitacao) => {
  return fetch(FETCH_METHODS.POST, `/encantar/solicitacao/reacao/${idSolicitacao}`, {
    dadosReacao,
    idSolicitacao,
  });
};

export const salvarRegistroEntrega = async (dadosEntrega, idSolicitacao) => {
  const {
    dataEnvio,
    identificadorEntrega,
    informacoes,
    tipoEntrega,
    valorFrete,
    anexos,
  } = dadosEntrega;
  return new Promise(async (resolve, reject) => {
    if (!dataEnvio) {
      reject("Campo data envio é obrigatório");
      return;
    }

    if (!tipoEntrega) {
      reject("Campo tipo da entrega é obrigatório");
      return;
    }
    if (!identificadorEntrega) {
      reject("Campo Identificador da entrega é obrigatório");
      return;
    }

    if (!dataEnvio) {
      reject("Campo data do envio é obrigatório");
      return;
    }

    try {
      var formData = new FormData();

      formData.append(
        "dataEnvio",
        moment(dataEnvio).format("YYYY-MM-DD HH:mm")
      );
      formData.append("identificadorEntrega", identificadorEntrega);
      formData.append("informacoes", informacoes);
      formData.append("tipoEntrega", tipoEntrega);
      formData.append("valorFrete", valorFrete ? valorFrete : 0);

      if (anexos) {
        if (anexos.fileList) {
          for (let anexo of anexos.fileList) {
            formData.append("files", anexo.originFileObj);
          }
        }
      }

      await apiModel.post(
        `/encantar/solicitacao/registrar-envio/${idSolicitacao}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );

      resolve();
    } catch (error) {
      console.log(error);
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const salvarRegistroRecebimento = async (
  dadosRecebimento,
  idSolicitacao
) => {
  const {
    problemaNaEntrega,
    anexos,
    dataRecebimento,
    observacoes,
  } = dadosRecebimento;
  return new Promise(async (resolve, reject) => {
    if (!dataRecebimento) {
      reject("Campo data recebimento é obrigatório");
      return;
    }
    if ((problemaNaEntrega && !observacoes) || observacoes === "") {
      reject(
        "Favor descrever qual problema ocorreu na entrega no campo de observações."
      );
      return;
    }

    try {
      var formData = new FormData();

      formData.append("dataRecebimento", dataRecebimento);
      formData.append("observacoes", observacoes);

      if (anexos) {
        if (anexos.fileList) {
          for (let anexo of anexos.fileList) {
            formData.append("files", anexo.originFileObj);
          }
        }
      }

      await apiModel.post(
        `/encantar/solicitacao/registrar-recebimento-prefixo/${idSolicitacao}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; boundary=500;",
          },
        }
      );

      resolve();
    } catch (error) {
      console.log(error);
      let msg =
        "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
      reject(msg);
    }
  });
};

export const salvarSolicitacao = async (dadosForm) => {
  try {
    var formData = new FormData();

    formData.append("mci", dadosForm.dadosCliente.MCI);
    formData.append(
      "prefixoFato",
      dadosForm.prefixoFato.prefixo
        ? dadosForm.prefixoFato.prefixo
        : dadosForm.prefixoFato
    );
    formData.append("dadosEntrega", JSON.stringify(dadosForm.dadosEntrega));
    formData.append(
      "enderecoCliente",
      JSON.stringify(dadosForm.enderecoCliente)
    );
    formData.append("dadosCliente", JSON.stringify(dadosForm.dadosCliente));
    formData.append("redesSociais", JSON.stringify(dadosForm.redesSociais));
    formData.append("idProdutoBB", dadosForm.produtoBB.id);
    formData.append("descricaoCaso", dadosForm.descricaoCaso);
    formData.append("txtCarta", dadosForm.txtCarta);
    formData.append(
      "brindesSelecionados",
      JSON.stringify(dadosForm.brindesSelecionados)
    );

    for (let anexo of dadosForm.anexos) {
      formData.append("files", anexo);
    }

    await apiModel.post(`/encantar/solicitacao/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data; boundary=500;",
      },
    });

    return new Promise((resolve, reject) => resolve());
  } catch (error) {
    let msg =
      "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const avancarNoFluxo = async (solicitacao, dadosAprovacao) => {
  const { justificativa, avaliacao, anexos, tipo } = dadosAprovacao;

  try {
    var formData = new FormData();
    formData.append("justificativa", justificativa);
    formData.append("avaliacao", avaliacao);
    formData.append("idSolicitacao", solicitacao.id);
    formData.append("tipo", tipo);
    if (anexos.fileList) {
      for (let anexo of anexos.fileList) {
        formData.append("files", anexo.originFileObj);
      }
    }

    await apiModel.post(
      `/encantar/solicitacao/avanca-fluxo/${solicitacao.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data; boundary=500;",
        },
      }
    );

    return new Promise((resolve, reject) => resolve());
  } catch (error) {
    let msg =
      "Erro do sistema. Favor tentar novamente. Caso o erro persista, contate o administrador do sistema.";
    return new Promise((resolve, reject) => reject(msg));
  }
};

export const fetchProdutosBB = async () => {
  return fetch(FETCH_METHODS.GET, `/encantar/produtosBB`);
};

/** API - CALLS */
export const getBrindesCatalogo = () => {
  return fetch(FETCH_METHODS.GET, "/encantar/catalogo/brindes");
};

export const fetchBrindeCatalogo = (id) => {
  return fetch(FETCH_METHODS.GET, "/encantar/catalogo/brindes/" + id);
};

export const deleteBrindeCatalogo = (idBrinde) => {
  return fetch(FETCH_METHODS.POST, "/encantar/catalogo/remover-brinde", { id: idBrinde });
};

export const salvarDadosBrinde = (dadosBrinde) => {
  const formData = new FormData();

  for (let chave in dadosBrinde) {
    if (chave !== "imagens") {
      if (chave === "imagensExcluir") {
        for (let id of dadosBrinde[chave]) {
          formData.append("imagensExcluir[]", id);
        }
      } else {
        formData.append(chave, dadosBrinde[chave]);
      }
    }
  }

  for (let imagem of dadosBrinde.imagens) {
    if (imagem.isNew) {
      formData.append("files[]", imagem.urlData);
    }
  }

  return fetch(FETCH_METHODS.POST, "/encantar/catalogo/salvar-brinde", formData, {
    headers: {
      "Content-Type": "multipart/form-data; boundary=12345678912345678;",
    },
  });
};

export const getBrindesEstoque = () => {
  return fetch(FETCH_METHODS.GET, "/encantar/estoque/get-brindes-prefixo");
};

export const mudarEstadoBrindeEstoque = (idEstoque, ativo) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/mudar-status-brinde", {
    idEstoque,
    ativo,
  });
};

export const deleteBrindeEstoque = (idEstoque) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/remover-brinde", { idEstoque });
};

export const alterarEstoqueBrinde = ({
  idEstoque,
  quantidade,
  tipoOperacao,
  justificativa,
}) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/alterar-valor-estoque", {
    idEstoque,
    quantidade,
    tipoOperacao,
    justificativa,
  });
};

export const incluirBrindesEstoque = (brindes) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/incluir-brindes-estoque", {
    brindes,
  });
};

export const fetchDetentoresEstoque = () => {
  return fetch(FETCH_METHODS.GET, "/encantar/estoque/detentores-estoque");
};

/**
 *   Recupera do banco de dados a lista de solicitações que um determinado cliente já foi público alvo.
 *   Não considerar aquelas que foram reprovadas
 *
 *   @param {String} mci
 *
 */

export const fetchSolicitacoesPorCliente = (mci) => {
  return fetch(FETCH_METHODS.GET, `/encantar/solicitacoes/por-cliente/${mci}`);
};

export const salvarDetentorEstoque = (prefixo, global) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/salvar-detentor-estoque", {
    prefixo,
    global,
  });
};

export const deleteDetentorEstoque = (id) => {
  return fetch(FETCH_METHODS.POST, "/encantar/estoque/remover-detentor-estoque", { id });
};

export const atualizaTextoCarta = (idSolicitacao, textoCartaAlterado) => {
  return fetch(FETCH_METHODS.POST, "/encantar/solicitacao/alterar-texto-carta", {
    id: idSolicitacao,
    textoCartaAlterado,
  });
};

export const fetchStatusSolicitacoes = () => {
  return fetch(FETCH_METHODS.GET, "/encantar/solicitacao/status-solicitacoes");
};
