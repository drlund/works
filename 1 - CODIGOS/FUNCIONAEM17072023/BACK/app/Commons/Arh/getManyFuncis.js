const pretifyFunci = require('./pretifyFunci');

const funciModel = use('App/Models/Mysql/Funci');
const exception = use('App/Exceptions/Handler');

async function getFuncisByMatricula(arrayMatriculas) {

  const funcis = await funciModel.query()
    .select("*")
    .table("arhfot01")
    .whereIn("matricula", arrayMatriculas)
    .with("nomeGuerra")
    .with("dependencia")
    .fetch();

  if (!funcis) {
    throw new exception("Funcionários não encontrados.", 404);
  }

  return funcis.toJSON().map((funci) => {
    return pretifyFunci(funci);
  });

}

/**
 * Nova versão que retorna um array funci (pode ser vazio) e não throw exception
 * Nesta versão também é retornado o mesmo que o `getOneFunci`
 * @param {string[]} arrayMatriculas
 */
async function getManyFuncis(arrayMatriculas) {
  const funcis = await funciModel.query()
    .select("*")
    .table("arhfot01")
    .whereIn("matricula", arrayMatriculas)
    .with("dependencia", (builder) => {
      builder.where("cd_subord", "00");
    })
    .with("dadosComissao")
    .with("nomeGuerra")
    .with("estCivil")
    .fetch();

  if (!funcis) {
    return [];
  }

  return /** @type {import('./pretifyFunci').RawFunci[]} */(funcis.toJSON())
    .map((funci) => pretifyFunci(funci));
}

module.exports = getFuncisByMatricula;
module.exports = {
  getManyFuncis
};
