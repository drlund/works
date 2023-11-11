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
      .whereNot("cd_gerev_juris", prefixo)
      .whereNot("cd_gerev_juris", "0000")
      .fetch()

    return !!agencia.rows.length;

  } catch (err) {
    throw new exception(err, 400);
  }
}