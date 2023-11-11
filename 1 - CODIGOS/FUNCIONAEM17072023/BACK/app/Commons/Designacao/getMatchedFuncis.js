const _ = require('lodash');
const pretifyFunci = require('../Arh/pretifyFunci');

const exception = use('App/Exceptions/Handler');

const funciModel = use('App/Models/Mysql/Funci');
const Designacao = use("App/Models/Mysql/Designacao");

const { BD, TIPOS } = use("App/Commons/Designacao/Constants");

async function getMatchedFuncis(funcionario, tipo) {
  try {
    const funcs = funciModel.query()
      .table("arhfot01")
      .where("matricula", 'like', `%${funcionario}%`)
      .orWhere("nome", 'like', `%${funcionario}%`)
      .with("nomeGuerra");

    // ! Adição: filtrar os funcionários pelo campo permiteAdicao da tabela superadm.cargos_e_comissoes

    if (tipo === TIPOS.ADICAO) {
      funcs
        .join('superadm.cargos_e_comissoes', 'arhfot01.funcao_lotacao', 'cargos_e_comissoes.cd_funcao')
        .where('cargos_e_comissoes.permiteAdicao', BD.SIM);
    }

    const funcis = await funcs.fetch();

    /** map original */
    const funcionarios = funcis.toJSON().map((funci) => {
      return pretifyFunci(funci, {editNomeGuerra: ""});
    });

    return funcionarios;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getMatchedFuncis;
