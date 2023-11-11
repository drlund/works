import moment from 'moment';
import 'moment/locale/pt-br';

export function relativeDateFromToday(/** @type {GetProps<typeof moment>} */ date) {
  return moment(date).locale('pt-br').from(moment());
}
