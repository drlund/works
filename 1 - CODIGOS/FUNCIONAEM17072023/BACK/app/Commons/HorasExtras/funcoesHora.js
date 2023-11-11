const exception = use('App/Exceptions/Handler');
const moment = require("moment");

const inicioFimMes = (data) => {
  const date = moment(data);
  if (!moment.isMoment(date)) throw new exception("Data fornecida está incompleta!", 400);

  return {inicioMes: moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss'), fimMes: moment(date).endOf('month').format('YYYY-MM-DD HH:mm:ss')};
}


module.exports = inicioFimMes;