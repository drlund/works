import moment from 'moment';
import 'moment/locale/pt-br';

const SABADO = 6;
const DOMINGO = 0;

const isDiaNaoUtil = (data, diasNaoUteis) => {
  const feriado = diasNaoUteis.some((elem) => (
    moment(elem).startOf('day').valueOf() === moment(data).startOf('day').valueOf()));
  const fimDeSemana = moment(data).day() === SABADO
     || moment(data).day() === DOMINGO;

  return feriado || fimDeSemana;
};

export default isDiaNaoUtil;
