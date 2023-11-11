import { findTagsDiff } from "./findTagsDiff";

/**
 * Retorna true se possui todos os campos necessários.
 * @param {string} template
 * @param {{ [key: string]: string }} fieldsMap
 */

export function checkIsValidTemplate(template, fieldsMap) {
  const tagsArr = findTagsDiff(template, fieldsMap);
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`🚀 ~ checkIsValidTemplate ~ tagsArr`, tagsArr);
  }
  return tagsArr.length === 0;
}
