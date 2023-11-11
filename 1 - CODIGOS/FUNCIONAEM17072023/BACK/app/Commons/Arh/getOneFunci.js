const pretifyFunci = require('./pretifyFunci');

const funciModel = use("App/Models/Mysql/Funci");

/**
 * @param {string} matricula
 */
async function getOneFunci(matricula) {
  const result = await funciModel
    .query()
    .select("*")
    .table("arhfot01")
    .where("matricula", matricula)
    .with("dependencia", (builder) => {
      builder.where("cd_subord", "00");
    })
    .with("dadosComissao")
    .with("nomeGuerra")
    .with("estCivil")
    .fetch();

  if (!result.first()) {
    return null;
  }

  const funci = /** @type {import('./pretifyFunci').RawFunci} */(result.first().toJSON());

  return pretifyFunci(funci);
}

module.exports = getOneFunci;
