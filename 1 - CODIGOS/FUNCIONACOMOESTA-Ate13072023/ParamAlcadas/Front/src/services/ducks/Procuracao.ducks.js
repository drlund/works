import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

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

// exemplo de fetch
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

/**
 * Obter os dados do funcionário na tabela fot01
 * @param {String} matricula 
 * @returns {Object}
 */
export const fetchDadosFunci = async (matricula) => {
  // return await fetch(FETCH_METHODS.GET, `/funci/${matricula}`);
  return new Promise(async (resolve, reject) => {
    try {
      const dadosFunci = await fetch(FETCH_METHODS.GET, `/funci/${matricula}`);
      if(!dadosFunci) throw new Error("Não é possível obter os dados do funcionario.")
      resolve(dadosFunci);
    } catch (error) {
      reject(error.message)
    }
  })
  
};

// exemplo post
export const gravarEsclarecimento = async esclarecimentoAtual => {
  return new Promise(async (resolve, reject) => {
    try {
      const esclarecimento = await fetch(FETCH_METHODS.POST, '/projetos/gravarEsclarecimento', { esclarecimentoAtual });
      if(!esclarecimento) throw new Error('Erro ao gravar o pedido de esclarecimento/observação.')
      resolve();
    } catch (error) {
      reject(error.message);
    }
  })
}

// exemplo de patch
export const updateEsclarecimento = async respostaEsclarecimento => {
  return new Promise(async (resolve, reject) => {
    try {
      const esclarecimento = await fetch(FETCH_METHODS.PATCH, '/projetos/updateEsclarecimento', { respostaEsclarecimento });
      if(!esclarecimento) throw new Error('Erro ao gravar a resposta do esclarecimento/observação.')
      resolve();
    } catch (error) {
      reject(error.message);
    }
  })
}

// exemplo de fromData (com anexo)
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
      formData.append("anexosServidor", JSON.stringify(anexosServidor));

      let gravado;
      let isCriacao;
      gravado = await fetch(FETCH_METHODS.POST, '/projetos/gravarProjeto', formData, { headers: { "Content-Type": "multipart/form-data; boundary=500;" } });

      if(!gravado) {
        throw new Error("Falha ao salvar o projeto.");
      }
      resolve({projetoNovo: isCriacao, idProjeto: gravado.data});
    } catch (error) {
      reject(error.message);
    }
  })
}