const funciModel = use('App/Models/Mysql/Funci');
const exception = use('App/Exceptions/Handler');
const _ = require('lodash');
const pretifyFunci = require('../Arh/pretifyFunci');
const getDotacaoDependencia = use('App/Commons/Designacao/getDotacaoDependencia');

//Private methods
async function getMatchedFuncisLotados(prefixo, comissao) {

  try {
    comissao += '';

    let funcis = await funciModel.query()
      .select("*")
      .where("ag_localiz", prefixo)
      .where("comissao", comissao.padStart(5, '0'))
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

module.exports = getMatchedFuncisLotados;
