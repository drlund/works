const exception = use('App/Exceptions/Handler');
const Superadm = use("App/Models/Mysql/Superadm");
const Dipes = use("App/Models/Mysql/DipesSas");
const _ = require('lodash');

//Private methods
async function getCPAFunci(funci) {

  let certs = await Dipes.query()
    .select("cod_curso")
    .from("arhp9050_certifexterna")
    .where("matricula", funci)
    .fetch();

  if (!certs) {
    throw new exception("Dados das certificaçoes do funcionário não encontrados.", 404);
  }

  certs = _.map(certs.toJSON(), (elem) => elem.cod_curso);

  let extCerts = await Superadm.query()
    .from("app_designacao_valida_certif_exigida")
    .whereIn("cod_certificacao", certs)
    .fetch();

  if (!extCerts) {
    throw new exception("Dados das certificações externas não encontrados.", 404);
  }

  extCerts = extCerts.toJSON();

  if (!_.isEmpty(extCerts)) {
    extCerts = extCerts.map(elem => {
      return {
        "cod_certificacao": elem.cod_certificacao,
        "nome_certificacao": elem.nome_certificacao,
        "0101109": elem["0101109"][0],
        "0101110": elem["0101110"][0],
        "0004160": elem["0004160"][0]
      }
    })
  }

  let cpaLista = [];

  if (!_.isEmpty(extCerts)) {
    cpaLista = new Set(extCerts.map(elem => elem.nome_certificacao));
    cpaLista = Array.from(cpaLista);
  }

  return { certs: extCerts, cpaLista: cpaLista };

}

module.exports = getCPAFunci;
