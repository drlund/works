const exception = use('App/Exceptions/Handler');
const Funci = use('App/Models/Mysql/Arh/Funci');
const Prefixo = use('App/Models/Mysql/Prefixo');
const Superadm = use('App/Models/Mysql/Superadm');
const _ = require('lodash');

/**
 * Metodo utilitario que verifica se uma comissao pertence a algum nivel gerencial.
 * Consulta efetuada na tabela superadm.cargos_e_comissoes.
 */
module.exports = async (chave, funcao = null) => {

  try {
    let codFuncao;
    let funci;
    let admin;

    if (chave && funcao === null) {
      funci = await Funci.query()
        .with("agLocaliz")
        .with("ddComissao")
        .with("funcaoLotacao")
        .where("matricula", chave)
        .first();

      funci = funci.toJSON();
      codFuncao = funci.comissao;
      admin = {...funci.ddComissao};
    } else if (funcao) {
      admin = await Superadm.query()
        .select('flag_administrador')
        .from('cargos_e_comissoes')
        .where('cd_funcao', funcao)
        .first();

      admin = admin.toJSON();
    }

    return !!admin.flag_administrador;
  } catch (err) {
    throw new exception(err, 404);
  }
}