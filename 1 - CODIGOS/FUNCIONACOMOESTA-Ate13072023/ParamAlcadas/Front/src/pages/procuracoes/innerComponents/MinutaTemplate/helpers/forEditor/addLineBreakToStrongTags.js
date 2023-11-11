/**
 * Faz o replace de abertura de strong tags que não são precedidas por uma quebra de linha
 *
 * As quebras de linhas não afetam o html renderizado, apenas o texto salvo.
 * @param {string} [htmlText]
 */
export function addLineBreakToStrongTags(htmlText) {
  const regexOpeningTagsWithoutBreakLines = /(?<!\n)(?<!\r\n)(<strong.*?\/strong>)/gm;
  return htmlText?.replace(regexOpeningTagsWithoutBreakLines, '\r\n$1\r\n');
}
