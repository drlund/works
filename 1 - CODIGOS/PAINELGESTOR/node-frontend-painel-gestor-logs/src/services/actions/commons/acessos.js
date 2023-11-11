import apiModel from 'services/apis/ApiModel';

/**
 * Action que salva/inclui uma ferramenta e suas permissoes na base de dados.
 * @param {*} dadosPermissoes - dados da ferramenta e suas permissoes.
 */
export const savePermissoesFerramenta = ({
  dadosPermissoes, responseHandler
}) => async () => {
  try {
    let response;

    if (dadosPermissoes.id) {
      response = await apiModel.patch('/acessos/ferramentas', { ...dadosPermissoes });
    } else {
      response = await apiModel.post('/acessos/ferramentas', { ...dadosPermissoes });
    }

    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};

/**
 * Remove uma ferramenta da lista.
 * Menu Especial Administrar.
 * @param {*} idFerramenta - id da ferramenta a ser removida
 */
export const deletePermissoesFerramenta = ({ idFerramenta, responseHandler }) => async () => {
  try {
    const response = await apiModel.delete(`/acessos/ferramentas/${idFerramenta}`);
    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};

/**
 * Action que obtem a lista de todas as ferramentas e suas permissoes.
 * Menu Especial Administrar.
 * @param {*} responseHandler
 */
export const fetchListaFerramentas = (responseHandler) => async () => {
  try {
    const response = await apiModel.get('/acessos/ferramentas');
    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};

/**
 * Action que salva/inclui uma ferramenta e suas permissoes na base de dados.
 * @param {*} dadosConcessao - dados da ferramenta e suas permissoes.
 */
export const saveConcessaoAcesso = ({ dadosConcessao, responseHandler }) => async () => {
  try {
    let response;

    if (dadosConcessao.id) {
      response = await apiModel.patch('/acessos/concessoes', { ...dadosConcessao });
    } else {
      response = await apiModel.post('/acessos/concessoes', { ...dadosConcessao });
    }

    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};

/**
 * Remove uma concessao de acesso da lista.
 * Menu Especial Administrar.
 * @param {*} idConcessao - id da concessao a ser removida
 */
export const deleteConcessaoAcesso = ({ idConcessao, responseHandler }) => async () => {
  try {
    const response = await apiModel.delete(`/acessos/concessoes/${idConcessao}`);
    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};

/**
 * Action que obtem a lista de todos as concessoes de acesso cadastradas no sistema.
 * Menu Especial Administrar.
 * @param {*} responseHandler
 */
export const fetchListaConcessoes = (ativo, responseHandler) => async () => {
  try {
    const response = await apiModel.get('/acessos/concessoes', {
      params: { ativo }
    });
    responseHandler.successCallback(response.data);
  } catch (error) {
    if (responseHandler && responseHandler.errorCallback) {
      const what = (error.response && error.response.data) ? error.response.data : null;
      responseHandler.errorCallback(what);
    }
  }
};
