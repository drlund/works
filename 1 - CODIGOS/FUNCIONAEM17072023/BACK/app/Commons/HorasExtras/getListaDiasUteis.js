const exception = use('App/Exceptions/Handler');
const {
  isFeriadoNacional,
  isFeriadoPrefixo,
  isFinalSemana,
  dateDiff
} = use("App/Commons/DateUtils");
const moment = use('App/Commons/MomentZoneBR');

async function getListaDiasUteis(inicio, fim, prefixo) {

  try {
    let dtIni = moment(inicio).startOf('day');
    let dtFim = moment(fim).startOf('day');

    const listaDatas = [];

    while (dtIni.isBefore(dtFim) || dtIni.isSame(dtFim)) {

      dtIni = dtIni.toISOString();

      const ferNac = await isFeriadoNacional(dtIni);
      const ferPref = await isFeriadoPrefixo(dtIni, parseInt(prefixo));
      const fimSem = await isFinalSemana(dtIni);

      if (ferNac || ferPref || fimSem) {
        dtIni = moment(dtIni).startOf('day').add(1, 'day');
        continue;
      }

      listaDatas.push(moment(dtIni).startOf('day'));

      dtIni = moment(dtIni).startOf('day').add(1, 'day');
    };

    return listaDatas;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getListaDiasUteis;