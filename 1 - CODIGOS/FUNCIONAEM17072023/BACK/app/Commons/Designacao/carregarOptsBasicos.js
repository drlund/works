const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const Designacao = use('App/Models/Mysql/Designacao');
const Superadm = use('App/Models/Mysql/Superadm');

async function carregarOptsBasicos(dados) {

  dados = JSON.parse(dados);
  const { funcao, prefixo, dotacao } = dados;

  try {
    let refer_org = await Superadm.query()
      .table("cargos_e_comissoes")
      .where("cod_funcao", funcao)
      .fetch();

    const [ref_org] = refer_org.toJSON();

    let opcoes = await Designacao.query()
      .table("opts_basicas")
      .fetch();

    opcoes = opcoes.toJSON();

    opcoes = opcoes.map(elem => {
      elem.tipo_comissao = _.isNil(elem.tipo_comissao) ? [] : JSON.parse(elem.tipo_comissao);
      elem.cods_ausencia = _.isNil(elem.cods_ausencia) ? [] : JSON.parse(elem.cods_ausencia);
      elem.cods_comissao = _.isNil(elem.cods_comissao) ? [] : JSON.parse(elem.cods_comissao);
      return elem;
    })

    // ? separar somente as linhas que contém a informação do código da comissão ou do tipo da comissão.
    opcoes = opcoes.filter(elem => {
      return !_.isEmpty(_.intersection(elem.cods_comissao, [parseInt(funcao)])) || !_.isEmpty(_.intersection(elem.tipo_comissao, [ref_org.ref_org]));
    })

    if (ref_org.ref_org === '1GUN' || (ref_org.ref_org === '2GUT' && ref_org.flag_administrador)) {
      const vacancia = dotacao.dotacao > dotacao.existencia;
      opcoes = opcoes.filter(elem => {
        switch (elem.id) {
          case 4:
            return dotacao.dotacao > dotacao.existencia
          case 10:
            return dot.dotacao > dot.existencia
          case 14:
            return ref_org.cod_funcao === '17103' && ref_org.ref_org === '1GUN' && dotacao.terGUN === 0;
          default:
            return !vacancia;
        }
      })
    } else {
      opcoes = opcoes.filter(elem => {
        switch (elem.id) {
          case 5:
            return dotacao.qtdeFuncis < 8;
          case 6:
            return dotacao.terGUN === 1;
          case 7:
            return dotacao.qtdeFuncis > 7 && dotacao.terGUN > 1;
          case 8:
            return dotacao.terGUN > 1;
          case 13:
            return dot.dotacao > dot.existencia;
          default:
            return true;
        }

      })
    }

    opcoes = opcoes.map(elem => {
      elem.tipo_comissao = _.intersection(elem.tipo_comissao, [ref_org.ref_org]);
      elem.cods_comissao = _.intersection(elem.cods_comissao, [funcao]);
      return elem;
    })

    return opcoes;
  } catch (err) {
    throw new exception(err);
  }

}

module.exports = carregarOptsBasicos;
