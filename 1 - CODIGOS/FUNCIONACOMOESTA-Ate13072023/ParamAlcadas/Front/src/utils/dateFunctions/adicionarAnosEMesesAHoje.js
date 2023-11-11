import moment from 'moment';

/**
 * Adiciona à data atual anos e meses conforme os parametros year e month.
 * Retorna a data no formato "YYYY-MM-DD".
 */
export const adicionarAnosEMesesAHoje = ({ year = 0, month = 0 }) => {
  return moment().add(year, "year").add(month, "month").format("YYYY-MM-DD");
};
