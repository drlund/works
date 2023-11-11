const _ = require('lodash');

const exception = use('App/Exceptions/Handler');

const Superadm = use("App/Models/Mysql/Superadm");
const Dipes = use("App/Models/Mysql/Dipes");

const Constants = use("App/Commons/Designacao/Constants");

async function getCPAFuncao(funcao, cd_diretor_juris) {
  cd_diretor_juris = cd_diretor_juris + '';
  const cpa = await Superadm.query()
    .distinct()
    .from('app_designacao_publico_alvo_certif_pref')
    .where('cod_comissao', funcao)
    .whereIn("prefixo", [cd_diretor_juris, '0000'])
    .fetch();

  const cpaLista = cpa.toJSON();

  let cpaListaFinal = cpaLista.map(elem => parseInt(elem.cod_cert_arh, 10));

  let cpaExig = cpaLista.filter(elem => elem.prefixo !== '0000');

  if (_.isEmpty(cpaExig)) {
    cpaExig = [...new Set(cpaLista)];
  } else {
    const listaCpa = Object.keys(Constants.LISTA_CPA).map(cpa => parseInt(cpa));
    cpaListaFinal = cpaExig.map(elem => listaCpa.includes(parseInt(elem.cod_cert_arh)) ? Constants.LISTA_CPA[parseInt(elem.cod_cert_arh)] : "");
  }

  return { cpa: cpaExig, cpaLista: [...new Set(cpaListaFinal)] };

}

module.exports = getCPAFuncao;
