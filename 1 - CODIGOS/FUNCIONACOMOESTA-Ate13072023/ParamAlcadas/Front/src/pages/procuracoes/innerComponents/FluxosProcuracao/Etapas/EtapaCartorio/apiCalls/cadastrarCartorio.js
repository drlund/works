import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/**
 *
 *  @typedef {Object} DadosCadastroCartorio
 *  @property {string} nome
 *  @property {string} cnpj
 *  @property {string} endereco
 *  @property {string} complemento
 *  @property {string} bairro
 *  @property {string} cep
 *  @property {string} municipio
 *
 */

/**
 *
 * @param {DadosCadastroCartorio} dadosCadastroCartorio
 */
const validarDados = (dadosCadastroCartorio) => {
  const camposObrigatorios = [
    'nome',
    'cnpj',
    'endereco',
    'complemento',
    'bairro',
    'cep',
    'municipio',
    'uf',
  ];

  return camposObrigatorios.reduce((erros, campo) => {
    if (!dadosCadastroCartorio[campo]) {
      erros.push(`O campo ${campo} é obrigatório`);
    }
    return erros;
  }, []);
};

const cadastrarCartorio = (dadosCadastroCartorio) => {
  const erros = validarDados(dadosCadastroCartorio);
  if (erros.length > 0) {
    return Promise.reject(erros);
  }

  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/cadastro/cadastrar-cartorio',
    dadosCadastroCartorio,
  );
};

export default cadastrarCartorio;
