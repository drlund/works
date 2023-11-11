import { findNonReplacedTags } from "./findNonReplacedTags";

/**
 * Retorna true se todos os data-minuta foram alterados.
 * @param {string} template
 * @param {string} templateBase
 */

export function checkIsValidReplaced(template, templateBase) {
  const tagsArr = findNonReplacedTags(template, templateBase);
  return tagsArr.length === 0;
}
