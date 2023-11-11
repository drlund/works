const funciModel = use('App/Models/Mysql/Funci');
const DipesSas = use('App/Models/Mysql/DipesSas');
const exception = use('App/Exceptions/Handler');
const _ = require('lodash');
const pretifyFunci = require('../Arh/pretifyFunci');
const getDotacaoDependencia = use('App/Commons/Designacao/getDotacaoDependencia')

//Private methods
async function getMatchedFuncisMovimentados(prefixo, comissao) {

  try {
    comissao += '';

    let funcis = await funciModel.query()
      .select("*")
      .where("funcao_lotacao", comissao.padStart(5, '0'))
      .where("prefixo_lotacao", prefixo)
      .whereIn("cod_situacao", [100, 510, 506])
      .with("nomeGuerra")
      .with("dependencia")
      .fetch();

    funcis = funcis.toJSON();

    return funcis.map((funci) => {
      return pretifyFunci(funci);
    });
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getMatchedFuncisMovimentados;
