const funciModel = use("App/Models/Mysql/Funci");

async function getDadosFunci(matricula) {
  const result = await funciModel
    .query()
    .select(
      "dt_imped_remocao",
      "nome",
      "dt_imped_comissionamento",
      "dt_imped_odi",
      "dt_imped_pas",
      "dt_imped_instit_relac",
      "dt_imped_demissao",
      "dt_imped_bolsa_estudos",
      "comissao",
      "email",
      "desc_cargo",
      "matricula",
      "ag_localiz"
    )
    .table("arhfot01")
    .where("matricula", matricula)
    .with("dependencia", builder => {
      builder.where("cd_subord", "00");
    })
    .first();

  if (!result) {
    return null;
  }

  const dadosFunci = result.toJSON();


  //Remove os espaços em branco nos dados do funci
  for (let key in dadosFunci) {
    dadosFunci[key] =
      typeof dadosFunci[key] === "string"
        ? dadosFunci[key].trim()
        : dadosFunci[key];
  }
  return dadosFunci;
}

module.exports = getDadosFunci;
