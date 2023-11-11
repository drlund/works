import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const aprovarMedidaIndividual = async ({
  idEnvolvido,
  deveAlterarMedida,
  novaMedida,
  novoParecer,
}) => {

  const dadosAprovacao = {
    idEnvolvido,
    deveAlterarMedida,
  };

  if (deveAlterarMedida === true && (!novaMedida || !novoParecer)) {
    return Promise.reject(
      'Caso queira alterar a medida, deve-se informar a nova medida e o novo parecer.',
    );
  }

  if (deveAlterarMedida === true) {
    dadosAprovacao.novaMedida = novaMedida;
    dadosAprovacao.novoParecer = novoParecer;
  }

  return fetch(
    FETCH_METHODS.POST,
    `/mtn/adm/envolvido/aprovar-medida-individual`,
    dadosAprovacao,
  );
};
