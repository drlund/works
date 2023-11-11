const checaPossuiEsclarecimentosPendentes = use(
  "App/Commons/Mtn/checaPossuiEsclarecimentosPendentes"
);
const checaPossuiRecursosPendentes = use(
  "App/Commons/Mtn/checaPossuiRecursosPendentes"
);

/**
 *
 *  Verifica se existe alguma pendência para o envolvido. Caso negativo, a pendência está na Super.
 *
 *  As pendências podem ser:
 *      1 - Esclarecimento não respondido e não fechado à revelia
 *      2 - Recurso não respondido e não fechado à revelia
 *
 *  @param {number} idEnvolvido Id do envolvido que se deseja consultar
 *
 */

const isPendenteEnvolvido = async (idEnvolvido) => {

  const possuiEsclarecimentosPendentes = await checaPossuiEsclarecimentosPendentes(
    idEnvolvido
  );

  const possuiRecursosPendentes = await checaPossuiRecursosPendentes(
    idEnvolvido
  );

  return possuiEsclarecimentosPendentes || possuiRecursosPendentes;
  
};

module.exports = isPendenteEnvolvido;
