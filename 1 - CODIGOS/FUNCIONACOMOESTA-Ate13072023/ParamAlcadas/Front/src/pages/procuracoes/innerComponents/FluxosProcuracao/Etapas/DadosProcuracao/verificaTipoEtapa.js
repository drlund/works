import { tiposEtapa } from './tiposEtapa';

/**
 * @param {tiposEtapa[keyof tiposEtapa]} tipoEtapa
 * @returns {tipoEtapa is tiposEtapa[keyof tiposEtapa]}
 */
export function verificaTipoEtapa(tipoEtapa) {
  if (
    tipoEtapa === null
    || Object.values(tiposEtapa).includes(tipoEtapa) === false
  ) {
    throw new Error('Tipo de etapa não informado');
  }

  return true;
}
