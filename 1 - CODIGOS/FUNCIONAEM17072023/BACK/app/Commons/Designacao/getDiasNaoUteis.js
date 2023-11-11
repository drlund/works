const exception = use('App/Exceptions/Handler');
const {
  getFeriadosNacionais,
  getFeriadosPrefixo,
  getFeriadosFixos,
} = use("App/Commons/DateUtils");
const moment = use('App/Commons/MomentZoneBR');

async function getDiasNaoUteis(prefixo) {

  try {
    const feriadosPrefixo = await getFeriadosPrefixo(prefixo);
    const feriadosNacionais = await getFeriadosNacionais();
    const feriadosFixos = await getFeriadosFixos();

    const feriadosFixosFormatados = [];
    feriadosFixos.map((dia) => {
      const data = dia.split('-').map((elem) => elem.padStart(2, '0')).join('-');
      const ano = moment().year();
      const anos = [ano, ano+1];
      return anos.map((ano) => {
        const date = ano + '-' + data;
        feriadosFixosFormatados.push(moment(date));
        return ano;
      });
    });

    const datas = [];
    if (feriadosPrefixo.length) datas.push(...feriadosPrefixo);
    if (feriadosNacionais.length) datas.push(...feriadosNacionais);
    if (feriadosFixosFormatados.length) datas.push(...feriadosFixosFormatados.map((data) => ({data_feriado: moment(data).startOf('day').toString()})));

    return datas;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDiasNaoUteis;