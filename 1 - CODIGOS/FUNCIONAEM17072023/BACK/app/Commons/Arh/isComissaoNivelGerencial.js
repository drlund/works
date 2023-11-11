const cargosComissoesModel = use('App/Models/Mysql/Arh/CargosComissoes');

/**
 * Metodo utilitario que verifica se uma comissao pertence a algum nivel gerencial.
 * Consulta efetuada na tabela superadm.cargos_e_comissoes.
 */
module.exports = async (comissao) => {
  let codFuncao = parseInt(comissao);

  let count = await cargosComissoesModel.query()
    .where('flag_ngerencial', 1)
    .where('cod_funcao', codFuncao)
    .getCount();

  return count > 0;
}