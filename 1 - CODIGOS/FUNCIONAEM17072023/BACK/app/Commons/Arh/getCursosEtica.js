const exception = use('App/Exceptions/Handler');
const Superadm = use("App/Models/Mysql/Superadm");
const Constants = use("App/Commons/Designacao/Constants");

async function getCursosEtica() {
  try {
    let etica = await Superadm.query()
      .select("cd_curso", "nm_curso")
      .from("app_designacao_etica")
      .where("curso_ativo", Constants.ATIVO)
      .orderBy("agrupar_curso")
      .fetch();

    return etica.toJSON();
  } catch (err) {
    throw new exception("Dados dos cursos de Ética não encontrados.", 404);
  }
}

module.exports = getCursosEtica;