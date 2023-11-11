import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/** Este ducks não possui reducers. */

/* ------------ API CALLS -------------- */

export const fetchPublicoAlvo = () => {
  return fetch(FETCH_METHODS.GET, "/autoridadessecex/publicoalvo");
}

export const addFunciToPublicoAlvo = (matricula) => {
  return fetch(FETCH_METHODS.POST, "/autoridadessecex/publicoalvo", { matricula });
}

export const deleteFuncisFromPublicoAlvo = (matriculas) => {
  return fetch(FETCH_METHODS.DELETE, "/autoridadessecex/publicoalvo", { matriculas: [...matriculas] });
}

export const fetchDadosAutoridades = () => {
  return fetch(FETCH_METHODS.GET, "/autoridadessecex/dadosautoridades");
}

export const processAutoridadesFile = (file) => {
  var formData = new FormData();
  formData.append("file", file);

  return fetch(FETCH_METHODS.POST, "/autoridadessecex/processar-arquivo", formData, {
    headers: {
      "Content-Type": "multipart/form-data; boundary=12345678912345678;",
    }
  });
}

export const fetchAniversariosAutoridades = (dataInicial, dataFinal) => {
  dataInicial = dataInicial.substr(0, 5);
  dataFinal = dataFinal.substr(0, 5);
  return fetch(FETCH_METHODS.GET, "/autoridadessecex/consulta-aniversariantes", { dataInicial, dataFinal });
}

export const fetchDownloadAniversariosAutoridades = (dataInicial, dataFinal) => {
  dataInicial = dataInicial.substr(0, 5);
  dataFinal = dataFinal.substr(0, 5);
  return fetch(FETCH_METHODS.GET, "/autoridadessecex/exporta-consulta-aniversariantes", { dataInicial, dataFinal }, {}, false, { responseType: 'blob' });
}

/* ------------ END - API CALLS -------------- */