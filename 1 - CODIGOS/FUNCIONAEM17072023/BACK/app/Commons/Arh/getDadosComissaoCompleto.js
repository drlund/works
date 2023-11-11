const exception = use('App/Exceptions/Handler');
const Dipes = use("App/Models/Mysql/Dipes");
const cargosComissoesModel = use('App/Models/Mysql/Arh/CargosComissoes');

/**
 * Metodo utilitario que verifica se uma comissao pertence a algum nivel gerencial.
 * Consulta efetuada na tabela superadm.cargos_e_comissoes.
 */
async function getDadosComissaoCompleto(comissao) {
  try {
    let codFuncao = parseInt(comissao);

    let cargo = await cargosComissoesModel.query()
      .where('cod_funcao', codFuncao)
      .first();

    if (!cargo) {
      throw new exception("Dados do cargo não encontrados.", 404);
    }

    cargo = cargo.toJSON();

    let funcao = await Dipes.query()
      .from("arhfot05")
      .where("cod_comissao", codFuncao)
      .first();

    if (funcao) {
      funcao = funcao.toJSON();
    } else {
      funcao = {};
    }

    const resultado = {
      ...cargo,
      ...funcao
    }

    return resultado;
  } catch (error) {
    throw new exception("Problemas na recuperação dos dados da comissão selecionada.", 400);
  }
}

module.exports = getDadosComissaoCompleto