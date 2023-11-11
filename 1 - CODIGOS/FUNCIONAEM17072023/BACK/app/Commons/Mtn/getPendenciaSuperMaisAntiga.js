const { orderBy } = require("lodash");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const envolvidoModel = use("App/Models/Postgres/MtnEnvolvido");
const { getDiasTrabalhadosPrefixo } = use("App/Commons/DateUtils");
const moment = require("moment");

const getIdsEnvolvidosPendenteEsclarecimento = async (idMtn, trx) => {
  const envolvidos = await envolvidoModel
    .query()
    .transacting(trx)
    .where("id_mtn", idMtn)
    .whereHas("esclarecimentos", (builder) => {
      builder.whereNull("respondido_em");
      builder.whereNull("revelia_em");
    })
    .orderBy("id", "desc")
    .fetch();

  return envolvidos ? envolvidos.toJSON().map((envolvido) => envolvido.id) : [];
};

const getIdsEnvolvidosPendenteRecurso = async (idMtn, trx) => {
  const envolvidos = await envolvidoModel
    .query()
    .transacting(trx)
    .where("id_mtn", idMtn)
    .whereHas("recursos", (builder) => {
      builder.whereNull("respondido_em");
      builder.whereNull("revelia_em");
    })
    .orderBy("id", "desc")
    .fetch();

  return envolvidos ? envolvidos.toJSON().map((envolvido) => envolvido.id) : [];
};

const getIdsEnvolvidosFinalizados = async (idMtn, trx) => {
  const envolvidos = await envolvidoModel
    .query()
    .transacting(trx)
    .where("id_mtn", idMtn)
    .whereNotNull("respondido_em")
    .orderBy("id", "desc")
    .fetch();
  return envolvidos ? envolvidos.toJSON().map((envolvido) => envolvido.id) : [];
};

/**
 *  Retorna ids dos envolvidos cuja pendência não estão na super
 * @param {*} idMtn
 */

const getIdsNaoPendentesSuper = async (idMtn, trx) => {
  const idsEnvolvidosPendenteEsclarecimento = await getIdsEnvolvidosPendenteEsclarecimento(
    idMtn,
    trx
  );
  const idsEnvolvidosPendenteRecurso = await getIdsEnvolvidosPendenteRecurso(
    idMtn,
    trx
  );

  const idsEnvolvidosFinalizados = await getIdsEnvolvidosFinalizados(
    idMtn,
    trx
  );

  return [
    ...idsEnvolvidosPendenteEsclarecimento,
    ...idsEnvolvidosPendenteRecurso,
    ...idsEnvolvidosFinalizados,
  ];
};

const getEnvolvidosPendenteSuper = async (idMtn, trx) => {
  const idsNaoPendentesSuper = await getIdsNaoPendentesSuper(idMtn, trx);
  const query = envolvidoModel.query().transacting(trx).where("id_mtn", idMtn);

  //Necessário pois o whereIn e whereNotIn não funcionam corretamente com arrays vazios
  if (idsNaoPendentesSuper.length > 0) {
    query.whereNotIn("id", idsNaoPendentesSuper);
  }
  const envolvidosPendentesSuper = await query
    .with("esclarecimentos", (builder) => {
      builder.orderBy("created_at", "desc");
    })
    .with("recursos", (builder) => {
      builder.orderBy("created_at", "desc");
    })
    .fetch();

  return envolvidosPendentesSuper.toJSON();
};

const getDataParaPendenciaSuper = (envolvido) => {
  const tiposInteracao = ["recursos", "esclarecimentos"];

  // Fiz 'for' normal pois não encontrei garantias de que o 'for of' mantem a ordem
  // O recurso tem que ser checado antes do esclarecimento
  for (let i = 0; i < tiposInteracao.length; i++) {
    const interacao = tiposInteracao[i];
    if (
      envolvido[interacao].length > 0 &&
      envolvido[interacao][0].respondido_em
    ) {
      return moment(envolvido[interacao][0].respondido_em, "DD/MM/YYYY HH:mm");
    }

    if (envolvido[interacao].length > 0 && envolvido[interacao][0].revelia_em) {
      moment(envolvido[interacao][0].revelia_em, "DD/MM/YYYY HH:mm");
    }
  }

  // Se não possui recurso e nem esclarecimento, a data é a criação do envolvido
  return envolvido.created_at;
};

/**
 *
 *  Retorna o envolvido com a pendência na super mais antiga. Caso não exista pendência na super, retorna null
 *
 *  @param {number} idMtn Id do mtn que se deseja recuperar a pendência mais antiga
 *
 *  @return {object} Instância do model, caso exista, e null caso não exista pendência na super.
 *
 */

const getPendenciaSuperMaisAntiga = async (idMtn, trx) => {
  const envolvidosPendentesSuper = await getEnvolvidosPendenteSuper(idMtn, trx);
  let envolvidoPendenteMaisAntigo = null;
  let = qtdDiasPendenciaMaisAntiga = 0;

  for (const envolvido of envolvidosPendentesSuper) {
    const dataPendenciaSuper = getDataParaPendenciaSuper(envolvido);
    const qtdDias = await getDiasTrabalhadosPrefixo(
      "9009",
      moment(dataPendenciaSuper),
      moment()
    );

    if (qtdDias >= qtdDiasPendenciaMaisAntiga) {
      qtdDiasPendenciaMaisAntiga = qtdDias;
      envolvidoPendenteMaisAntigo = envolvido;
      envolvidoPendenteMaisAntigo.qtdDias = qtdDias;
    }
  }
  return envolvidoPendenteMaisAntigo;
};

module.exports = getPendenciaSuperMaisAntiga;
