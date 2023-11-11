const pretifyFunci = require('./pretifyFunci');

const exception = use('App/Exceptions/Handler');
const funciModel = use("App/Models/Mysql/Funci");

//Private methods
async function getOneFunci(matricula) {
  const result = await funciModel
    .query()
    .select(
      "dt_imped_remocao",
      "dt_imped_comissionamento",
      "dt_imped_odi",
      "dt_imped_pas",
      "dt_imped_instit_relac",
      "dt_imped_demissao",
      "dt_imped_bolsa_estudos"
    )
    .table("arhfot01")
    .where("matricula", matricula)
    .with("dependencia", builder => {
      builder.where("cd_subord", "00");
    })
    .with("nomeGuerra")
    .fetch();
  let funci = result.first().toJSON();

  if (!funci) {
    throw new exception(
      "Funcionário " + matricula + " não encontrado.",
      404,
      "FUNCI_NOT_FOUND"
    );
  }

  return pretifyFunci(funci, { editNomeGuerra: false });
}

module.exports = getOneFunci;
