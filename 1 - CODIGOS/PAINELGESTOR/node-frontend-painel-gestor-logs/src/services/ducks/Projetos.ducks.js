import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';
import apiModel from "services/apis/ApiModel";

// ACTION TYPES
export const types = {};

// ESTADO INICIAL
const initialState = {};

// REDUCERS
export default (state = initialState, action) => {
  //let newState = _.cloneDeep(state);
  switch (action.type) {
    default:
      return state;
  }
};

// ACTIONS
// CHAMADAS DE API
export const fetchListaAtividades = async (matricula, statusTipo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lista = await fetch(FETCH_METHODS.GET, "/projetos/listaAtividades", { matricula, statusTipo });
      if(!lista) throw new Error("Não foi possível obter a lista de atividades.");
      resolve(lista);
    } catch (error) {
      reject(error.message);
    }
  })
}

export const alterarAtividadeByCentral = async (idProjeto, idStatusProjeto, idAtividade, idStatusAtividade) => {
  return new Promise(async (resolve, reject) => {
    try {
      const atividade = await fetch(FETCH_METHODS.PATCH, "/projetos/alterarAtividade", { idProjeto, idStatusProjeto, idAtividade, idStatusAtividade })
      if(!atividade) throw new Error("Não foi possível alterar esta Atividade.")
      resolve(atividade);
    } catch (error) {
      reject(error.message)
    }
  })
}

export const fetchListaProjetos = async (andamento, statusTipo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const lista = await fetch(FETCH_METHODS.GET, "/projetos/", { andamento, statusTipo });
      if(!lista) throw new Error("Não foi possível obter a lista de projetos.");
      resolve(lista);
    } catch (error) {
      reject(error.message);
    }
  })
}

export const fetchProjeto = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const projeto = await fetch(FETCH_METHODS.GET, "/projetos/buscarProjeto", { id })
      if(!projeto) throw new Error("Não é possível carregar este Projeto.")
      resolve(projeto);
    } catch (error) {
      reject(error.message)
    }
  })
}

export const fetchDadosFunci = async (matricula) => {
  return await fetch(FETCH_METHODS.GET, `/funci/${matricula}`);
};

export const gravarProjeto = async (projetoAtual) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { informacaoBasica, responsaveis, funcionalidades, anexos, anexosServidor, atividades} = projetoAtual;
      const formData = new FormData();
      // adicionar todos os objetos no formdata
      formData.append("informacaoBasica", JSON.stringify(informacaoBasica));
      formData.append("responsaveis", JSON.stringify(responsaveis));
      formData.append("funcionalidades", JSON.stringify(funcionalidades));
      formData.append("atividades", JSON.stringify(atividades))
      anexos.forEach((file) => {
        formData.append("files[]", file);
      });
      formData.append("anexosServidor", JSON.stringify(anexosServidor))

      let gravado;
      let isCriacao;
      // projeto novo
      if(!informacaoBasica.id) {
        gravado = await apiModel.post(
          `/projetos/gravarProjeto`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data; boundary=500;",
            },
          }
        );
        isCriacao = true;
      }
      // alteração no projeto
      else {
        gravado = await apiModel.patch(
          `/projetos/alterarProjeto`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data; boundary=500;",
            },
          }
        );
        isCriacao = false;
      }

      if(!gravado) {
        throw new Error("Falha ao salvar o projeto.");
      }
      resolve({projetoNovo: isCriacao, idProjeto: gravado.data});
    } catch (error) {
      reject(error.message)
    }
  })
};

export const excluirProjeto = async idProjeto => {
  return new Promise(async (resolve, reject) => {
    try {
      const projeto = await fetch(FETCH_METHODS.PATCH, "/projetos/excluirProjeto", { idProjeto })
      if(!projeto) throw new Error("Não foi possível excluir este Projeto.")
      resolve(projeto);
    } catch (error) {
      reject(error.message)
    }
  })
}

export const gravarEsclarecimento = async esclarecimentoAtual => {
  return new Promise(async (resolve, reject) => {
    try {
      const esclarecimento = await fetch(FETCH_METHODS.POST, '/projetos/gravarEsclarecimento', esclarecimentoAtual);
      if(!esclarecimento) throw new Error('Erro ao gravar o pedido de esclarecimento/observação.')
      resolve();
    } catch (error) {
      reject(error.message);
    }
  })
}

export const updateEsclarecimento = async respostaEsclarecimento => {
  return new Promise(async (resolve, reject) => {
    try {
      const esclarecimento = await fetch(FETCH_METHODS.PATCH, '/projetos/updateEsclarecimento', respostaEsclarecimento);
      if(!esclarecimento) throw new Error('Erro ao gravar a resposta do esclarecimento/observação.')
      resolve();
    } catch (error) {
      reject(error.message);
    }
  })
}

export const gravarPausa = async pausa => {
  return new Promise(async (resolve, reject) => {
    try {
      const retorno = await fetch(FETCH_METHODS.POST, '/projetos/gravarPausa', { pausa });
      if(!retorno) throw new Error('Erro ao gravar a pausa.')
      resolve();
    } catch (error) {
      reject(error.message);
    }
  })
}
