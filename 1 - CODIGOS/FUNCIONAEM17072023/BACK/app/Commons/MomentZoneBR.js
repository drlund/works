/**
 * !!! ATENCAO !!!
 * UTILIZAR ESTA ARQUIVO APENAS EM LOCAIS QUE GRAVAM / RECUPERAM DADOS DE BANCOS RELACIONAIS (TIMEZONE SAO_PAULO).
 * Encapsulamento do moment-timezone para configurar o timezone do Brasil corretamente.
 */
const baseMoment = require('moment-timezone');

const moment = (ts = null) => {
  
  if(!ts){
    return baseMoment.tz('America/Sao_Paulo');
  }

  return baseMoment.tz(ts, 'America/Sao_Paulo');
}

module.exports = moment;

