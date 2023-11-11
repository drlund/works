import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const validate = (prefixoAvaliacao) => {
  const erros = [];

  if (!prefixoAvaliacao.ambientes) {
    erros.push('Lista de ambientes é obrigatória');
    return erros;
  }

  for (const ambiente of prefixoAvaliacao.ambientes) {
    if (
      !ambiente.avaliacao ||
      (ambiente.avaliacao && ambiente.avaliacao === 0)
    ) {
      erros.push(`Ambiente ${ambiente.ambienteNome} não foi avaliada.`);
    }
  }

  return erros;
};

const transformPrefixoAvaliacao = (prefixoAvaliacao) => {
  return {
    idLock: prefixoAvaliacao.idLock,
    avaliacoes: prefixoAvaliacao.ambientes.map((ambiente) => {
      return {
        nota: ambiente.avaliacao,
        ambienteTipo: ambiente.ambienteId,
        qtdImagens: ambiente.imagens.length,
      };
    }),
  };
};

const registrarAvaliacao = async (prefixoAvaliacao) => {
  const erros = validate(prefixoAvaliacao);
  if (erros.length > 0) {
    return Promise.reject(erros);
  }

  const transformedPrefixoAvaliacao =
    transformPrefixoAvaliacao(prefixoAvaliacao);

  return fetch(
    FETCH_METHODS.POST,
    `/ambiencia/registrar-avaliacao/`,
    transformedPrefixoAvaliacao,
  );
};

export default registrarAvaliacao;
