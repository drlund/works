import { kebabToCamel } from '../others/kebabToCamel';

/**
 * Faz o parse do template e retorna os valores dos datasets.
 * Usar as partes depois de "data-" no formato kebab.
 * @param {String} template html template
 * @param {String} datasetKeyKebab dataset que vai ser usada para buscar os elementos
 * @param {String[]} [datasetListKebab] array de datasets que serão retornadas.
 * É possível retornar o dataset que foi procurado mais outros ou mesmo procurar por um e retornar apenas outro
 * @returns {(string | {[key: string]: string})[]} lista de objetos/strings do datasetList,
 * retorna apenas uma lista simples caso a lista tenha um elemento
 */
export function getDatasetFromTemplate(
  template,
  datasetKeyKebab,
  datasetListKebab,
) {
  return Array.from(
    new DOMParser()
      .parseFromString(template, 'text/html')
      .querySelectorAll(`[data-${datasetKeyKebab}]`)
  )
    .map((el) => (datasetListKebab || [datasetKeyKebab]).reduce((acc, key) => {
      const camelKey = kebabToCamel(key);
      // @ts-ignore
      acc[camelKey] = el.dataset[camelKey];
      return acc;
    }, {}))
    .map((item) => {
      if (Object.keys(item).length === 1) {
        return Object.values(item)[0];
      }
      return item;
    });
}
