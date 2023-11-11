/* const _downloadAnexoService = async ({
  idAnexo,
  fileName,
  responseHandler,
}) => {
  try {
    let response = await apiModel.get('/mtn/adm/anexos/download/' + idAnexo, {
      responseType: 'blob',
    });
    DownloadFileUtil(fileName, response.data);
    responseHandler.successCallback();
  } catch (error) {
    let what =
      error.response && error.response.data ? error.response.data : null;
    responseHandler.errorCallback(what);
  }
}; */

import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const downloadAnexoService = async (anexoUrl) =>
  fetch(
    FETCH_METHODS.GET,
    'flexcriterios/anexos/download',
    { anexoUrl },
    undefined,
    undefined,
    { responseType: 'blob' },
  );

export const inserirNovosAnexos = async (anexos, idFlex) =>
  fetch(FETCH_METHODS.POST, 'flexcriterios/anexos/novos', {
    anexos,
    idFlex,
  });
