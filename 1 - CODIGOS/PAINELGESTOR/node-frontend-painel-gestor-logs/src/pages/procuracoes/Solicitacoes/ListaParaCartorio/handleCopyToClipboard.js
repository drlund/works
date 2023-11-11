import { message } from 'antd';

/**
 * @param {string} [content]
 * Copia rich text ou plain text para o clipboard
 */
export function handleCopyToClipboard(content) {
  return async () => {
    try {
      if (!content) {
        throw new Error("No content");
      }

      if (!navigator.clipboard.write || !window.ClipboardItem) {
        fallbackCopyTextToClipboard(content);
      } else {
        const blobInput = new Blob([content], { type: 'text/html' });
        const blobText = new Blob([content], { type: 'text/plain' });
        const clipboardItemInput = new ClipboardItem({
          'text/html': blobInput,
          'text/plain': blobText,
        });
        await navigator.clipboard.write([clipboardItemInput]);
      }

      return message.success('Copiado!');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return message.warn('Não foi possível copiar.');
    }
  };
}

/**
 * Firefox não tem algumas api necessárias, então vai cair neste fallback
 */
function fallbackCopyTextToClipboard(/** @type {string} */ html) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  // styles, provavelmente desnecessários,
  // mas garantem que não ficarão visiveis
  // ou que vão gerar flashes durante a cópia
  tempElement.style.position = 'fixed';
  tempElement.style.top = '0';
  tempElement.style.left = '0';
  tempElement.style.width = '1px';
  tempElement.style.height = '1px';
  tempElement.style.padding = '0';
  tempElement.style.border = 'none';
  tempElement.style.outline = 'none';
  tempElement.style.boxShadow = 'none';
  tempElement.style.background = 'transparent';

  document.body.appendChild(tempElement);

  const range = document.createRange();
  range.selectNode(tempElement);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  document.execCommand("copy");

  document.body.removeChild(tempElement);
}
