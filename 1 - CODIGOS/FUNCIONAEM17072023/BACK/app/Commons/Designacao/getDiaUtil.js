const exception = use('App/Exceptions/Handler');
const {
  isFeriadoNacional,
  isFeriadoPrefixo,
  isFinalSemana
} = use("App/Commons/DateUtils");
const moment = use('App/Commons/MomentZoneBR');

async function getDiaUtil(data, prefixo, quando) {
  try {
    let date = moment(data).startOf('day');
    let util = false;

    while (!util) {

      date = date.toISOString();

      const ferNac = await isFeriadoNacional(date);
      const ferPref = await isFeriadoPrefixo(date, parseInt(prefixo));
      const fimSem = await isFinalSemana(date);

      if (!ferNac && !ferPref && !fimSem) {
        util = !util;
      } else {
        if (quando === 1) {
          date = moment(date).startOf('day').add(1, 'days');
        }
        if (quando === 2) {
          date = moment(date).startOf('day').subtract(1, 'days');
        }
      }
    };

    return date;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getDiaUtil;