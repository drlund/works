import moment from 'moment';

/**
 * Retorna a data no formato DD/MM/YYYY.
 * @param {string|Date|moment.Moment} data
 */
export function displayDateBR(data) {
  return moment(data).format("DD/MM/YYYY");
}
