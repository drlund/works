import { getDatasetFromTemplate } from '../forHtml/getDatasetFromTemplate';
import { getArraysDiff } from './getArraysDiff';

/**
 * Verifica a diferença entre as keys em fieldsMap e o dataset no template.
 * @param {string} template
 * @param {{[key: string]: string}} fieldsMap
 */

export function findTagsDiff(template, fieldsMap) {
  const fromTemplate = /** @type {string[]} */ ([
    ...getDatasetFromTemplate(template, 'minuta'),
    ...getDatasetFromTemplate(template, 'minuta-blocked'),
  ]);

  return getArraysDiff(fromTemplate, Object.keys(fieldsMap), true).right;
}
