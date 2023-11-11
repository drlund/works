const exception = use('App/Exceptions/Handler');
const Dipes = use('App/Models/Mysql/Dipes');
const _ = require('lodash');

/**
 * Metodo utilitario que verifica se uma comissao pertence a algum nivel gerencial.
 * Consulta efetuada na tabela superadm.cargos_e_comissoes.
 */
module.exports = async (prefixo) => {

  try {
    let agencia = await Dipes.query()
      .select("nome")
      .from("mst606")
      .where("prefixo", prefixo)
      .where("cd_subord", "00")
      .whereIn("tip_dep", [3, 4])
      .fetch()

    return !!agencia.rows.length;

  } catch(error) {
    throw new exception("Dados do prefixo não encontrados.", 400);
  }
}