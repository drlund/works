import { getDatasetFromTemplate } from '../forHtml/getDatasetFromTemplate';
import { getArraysDiff } from './getArraysDiff';

/**
 * - data-minuta-ok: representa as partes alteradas
 * - data-minuta: representa as partes não alteradas
 *
 * - data-minuta-blocked-ok: representa as partes blockeadas para edição alteradas
 * - data-minuta-blocked: representa as partes blockeadas para edição não alteradas
 *
 * data-minuta* tem como valor a chave e são comparados o que foi ou não alterados.
 *
 * Com isso, reduzimos e é retornado as chaves dos data-minuta que precisam ainda ser alterados.
 * @param {string} template
 * @param {string} templateBase
 */

export function findNonReplacedTags(template, templateBase) {
  const replacedInTemplate = /** @type {string[]} */ ([
    ...getDatasetFromTemplate(template, 'minuta-ok'),
    ...getDatasetFromTemplate(template, 'minuta-blocked-ok'),
  ]);

  const fromTemplateBase = /** @type {string[]} */ ([
    ...getDatasetFromTemplate(templateBase, 'minuta'),
    ...getDatasetFromTemplate(templateBase, 'minuta-blocked'),
  ]);

  return getArraysDiff(replacedInTemplate, fromTemplateBase).right;
}
