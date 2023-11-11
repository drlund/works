const Superadm = use('App/Models/Mysql/Superadm');
const Dipes = use('App/Models/Mysql/Dipes');
const optBas = use('App/Models/Mysql/Designacao/OptBasica')
const exception = use('App/Exceptions/Handler');
const _ = require('lodash');

//Private methods
async function getDotacaoDependencia(dependencia, ger, gest) {

  let terGUN, qtdeFuncis;

  let dotacao = await Dipes.query()
    .table("arhfot09")
    .where("cod_dependencia", dependencia)
    .whereRaw('(qtde_dotacao + qtde_lotacao + qtde_existencia) > ?', 0)
    .fetch();

  if (!dotacao) {
    throw new exception("Dotação não encontrada.", 404);
  }

  dotacao = dotacao.toJSON();

  let fn_ger = [];
  let ref_org_3gun = [];

  let fun_ger;

  if (ger || gest) {

    if (ger) {

      let fns = await optBas.find(3);

      if (!fns) {
        throw new exception("Lista de funções não recuperada!", 404);
      }

      fns = fns.toJSON();

      fns = JSON.parse(fns.cods_comissao);

      fun_ger = await Superadm.query()
        .select("cod_funcao", "ref_org", "flag_ngerencial", "flag_administrador")
        .from('cargos_e_comissoes')
        .where('ref_org', '3GUN')
        .orWhereIn('cd_funcao', fns)
        .fetch();

      if (!fun_ger) {
        throw new exception("Cargos e Comissões não localizados!", 404);
      }

      fun_ger = fun_ger.toJSON();

      ref_org_3gun = fun_ger.filter(elem => elem.ref_org === "3GUN");
      ref_org_3gun = ref_org_3gun.map(elem => elem.cod_funcao);
    }

    if (gest) {
      fun_ger = await Superadm.query()
        .select("cod_funcao", "ref_org", "flag_ngerencial", "flag_administrador")
        .from('cargos_e_comissoes')
        .where('flag_administrador', 0)
        .fetch();

      if (!fun_ger) {
        throw new exception("Cargos e Comissões não localizados!", 404);
      }

      fun_ger = fun_ger.toJSON();
    }

    fn_ger = fun_ger.map(elem => elem.cod_funcao.padStart(5, '0'));

    terGUN = dotacao.filter(elem => !_.isEmpty(_.intersection(ref_org_3gun, [elem.cod_cargo]))).map(elem => elem.qtde_lotacao).reduce(((acc, cur) => acc + cur), 0);

    //dotacao = dotacao.filter(elem => !_.isEmpty(_.intersection(fn_ger, [elem.cod_cargo])));

    dotacao = dotacao.filter(elem => fn_ger.includes(elem.cod_cargo))
  }

  qtdeFuncis = dotacao.map(elem => elem.qtde_dotacao).reduce(((acc, cur) => acc + cur), 0);

  dotacao = dotacao.map((dep) => {
    const dados = {
      key: dep["cod_cargo"],
      prefixo: dep["cod_dependencia"],
      codFuncao: dep["cod_cargo"],
      nmFuncao: dep["nome_cargo"],
      lotacao: dep["qtde_lotacao"],
      dotacao: dep["qtde_dotacao"],
      existencia: dep["qtde_existencia"],
      vagas: dep["qtde_vagas"],
      vacancia: dep["qtde_dotacao"] - dep["qtde_existencia"]
    }

    return dados;
  });

  if (_.isEmpty(dotacao)) {
    return {};
  }

  return { dotacao, terGUN, qtdeFuncis };

}

module.exports = getDotacaoDependencia;
