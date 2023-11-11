import { adicionarAnosEMesesAHoje } from './adicionarAnosEMesesAHoje';

/**
 * Retorna a data de expiração futura do membro com base no numero de meses.
 * Defaulta para 1 ano.
 */
export function setDataExpiracaoFutura(month = 0) {
  return adicionarAnosEMesesAHoje({ year: month ? 0 : 1, month });
}
