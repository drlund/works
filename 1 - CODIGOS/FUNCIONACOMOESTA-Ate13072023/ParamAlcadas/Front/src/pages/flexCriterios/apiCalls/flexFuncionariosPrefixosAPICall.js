import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getFuncionario = (matricula) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/funcibymatricula', { matricula });
export const getFuncionarioAnalise = (
  matricula,
  prefixoDestino,
  funcaoDestino,
) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/analisefunci', {
    matricula,
    prefixoDestino,
    funcaoDestino,
  });
export const getPrefixoDestino = (prefixo) =>
  fetch(FETCH_METHODS.GET, 'flexcriterios/dadosprefixo', { prefixo });

// TODO mocks para testes ou ainda não implementada a rota verdadeira
// import {
//   getFuncionarioAnaliseMock,
//   getFuncionarioMock,
//   getPrefixoDestinoMock,
// } from '../mock/rotasMock';
// export const getFuncionario = async () => getFuncionarioMock();
// export const getFuncionarioAnalise = async () => getFuncionarioAnaliseMock();
// export const getPrefixoDestino = async (prefixo) =>
//   getPrefixoDestinoMock(prefixo);
