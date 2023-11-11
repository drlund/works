import { ExtractErrorMessage } from 'utils/Commons';

/**
 * DUCK utilitario para actions que retornam dados (nodes) de instrucões normativas.
 * 
 */
import apiModel from 'services/apis/ApiModel';

const fetchINCNodes = ({nroINC, codTipoNormativo, baseItem}) => async () => {

  if (nroINC === undefined || String(nroINC).length === 0) {
    return new Promise((resolve, reject) => reject('Informe o número da IN!'))
  }

  if (codTipoNormativo === undefined || String(codTipoNormativo).length === 0) {
    return new Promise((resolve, reject) => reject('Informe o tipo de normativo!'))
  }

  try {
    let response = await apiModel.get("/inc", { params: {
      nroINC,
      codTipoNormativo,
      baseItem
    }});

    let responseData = response.data;

    if (!responseData) {
      return new Promise((resolve, reject) => reject('Nenhum registro encontrado para os dados informados.'))
    }
  
    return new Promise(resolve => { 
      resolve(responseData) 
    });

  } catch (error) {
    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados deste normativo.');
    return new Promise((resolve, reject) => reject(msg))
  }
}

const searchINC = (searchTerm, cancelToken = null) => async () => {

  if (searchTerm === undefined || String(searchTerm).length === 0) {
    return new Promise((resolve, reject) => reject('Informe um número ou texto para pesquisa!'))
  }

  try {
    let cancelParam = cancelToken ? { cancelToken } : {}
    let response = await apiModel.get("/inc/search", { 
      params: { searchTerm }, 
      ...cancelParam
    });

    let responseData = response.data;

    return new Promise(resolve => { 
      resolve(responseData) 
    });

  } catch (error) {
    if (cancelToken) {
      return new Promise((resolve, reject) => reject(error))
    }

    let msg = ExtractErrorMessage(error, 'Falha ao obter os dados desta consulta.');
    return new Promise((resolve, reject) => reject(msg))
  }
}


export {
  fetchINCNodes,
  searchINC
}