import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const validarDados = (dadosCadastroSubsidiaria) => {
  const camposObrigatorios = [
    'nome',
    'nomeReduzido',
    'cnpj',
    'endereco',
    'complemento',
    'bairro',
    'cep',
    'municipio',
    'uf',
  ];

  return camposObrigatorios.reduce((erros, campo) => {
    if (!dadosCadastroSubsidiaria[campo]) {
      erros.push(`Campo ${campo} é obrigatório`);
    }
    return erros;
  }, []);
};

const cadastrarSubsidiaria = (dadosCadastroSubsidiaria) => {
  const erros = validarDados(dadosCadastroSubsidiaria);
  if (erros.length > 0) {
    return Promise.reject(erros);
  }

  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/cadastro/cadastrar-subsidiaria',
    dadosCadastroSubsidiaria,
  );
};

export default cadastrarSubsidiaria;
