import { getDatasetFromTemplate } from './getDatasetFromTemplate';
import { pick } from '../others/pick';

/**
 * @typedef {typeof import('../forGeneratedData/createReplacerMap').createReplacerMap} CreateReplacerMap
 */

/**
 * Pega um template e um mapa, trocando os placeholders pelos valores no mapa.
 * @param {{
 *  templateBase: string,
 *  replacerMap: ReturnType<CreateReplacerMap>
 * }} props
 * @returns {string} template com os placeholders trocados
 */
export function replaceInTemplate({ templateBase, replacerMap }) {
  const nonBlockedText = (/** @type {string[]} */ (getDatasetFromTemplate(templateBase, 'minuta'))
    .reduce(
      (/** @type {string} */ acc, key) => {
        const value = pick(`custom.${key}`, replacerMap, pick(/** @type {string} */(key), replacerMap));
        if (!value) {
          return acc;
        }

        return acc.replace(
          new RegExp(`<strong style="color: ?red;?" data-display="(.*?)" data-minuta="${key}">.*?</strong>`, 'gm'),
          `<strong style="color: black;" data-display="$1" data-minuta-ok="${key}">${value}</strong>`
        );
      },
      templateBase
  ));

  return (/** @type {string[]} */ (getDatasetFromTemplate(templateBase, 'minuta-blocked')))
    .reduce(
      (acc, key) => {
        const value = pick(`custom.${key}`, replacerMap, pick(key, replacerMap));
        if (!value) {
          return acc;
        }

        return (/** @type {string} */ (acc)).replace(
          new RegExp(`<strong style="color: ?green;?" data-display="(.*?)" data-minuta-blocked="${key}">.*?</strong>`, 'gm'),
          `<strong style="color: black;" data-display="$1" data-minuta-blocked-ok="${key}">${value}</strong>`
        );
      },
      nonBlockedText
    );
}
