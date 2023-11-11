/**
 * Usando o novo formato de geração.
 * O TinyMCE as vezes coloca algumas coisas que não deveria
 * Esta função remove elas.
 *
 * @param {string} htmlText
 */
export function cleanHTML(htmlText) {
  return htmlText
    .replace(/id="" /g, '')
    .replace(/data-mce-style="color: .*?;"/g, '')
    .replace(/[^\S\r\n]+/g, ' ');
}
