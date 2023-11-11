const exception = use('App/Exceptions/Handler');
const {
  isFeriadoNacional,
  isFeriadoPrefixo,
  isFinalSemana,
  dateDiff
} = use("App/Commons/DateUtils");
const moment = use('App/Commons/MomentZoneBR');

async function getQtdeDias(inicio, fim, prefixo) {

  try {
    let dtIni = moment(inicio).startOf('day');
    let dtFim = moment(fim).startOf('day');
    // let dtIni = moment().startOf('day').add(1, 'days'); // teste para o Insomnia

    const qtdeDias = dateDiff(moment(dtIni), moment(dtFim)) + 1;

    let qtdeDiasUteis = 0;

    while (dtIni.isBefore(dtFim) || dtIni.isSame(dtFim)) {

      dtIni = dtIni.toISOString();

      const ferNac = await isFeriadoNacional(dtIni);
      const ferPref = await isFeriadoPrefixo(dtIni, parseInt(prefixo));
      const fimSem = await isFinalSemana(dtIni);

      if (!ferNac && !ferPref && !fimSem) {
        qtdeDiasUteis += 1;
      }

      dtIni = moment(dtIni).startOf('day').add(1, 'days');

    };

    return { qtdeDias, qtdeDiasUteis };
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getQtdeDias;