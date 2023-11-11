import { message } from 'antd';
import { useState } from 'react';

/** @typedef {string|null} CopiedValue */
/** @typedef {(text: string) => Promise<boolean>} CopyFn */

/** @return {[CopiedValue, CopyFn]} */

function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(/** @type {CopiedValue} */(null));

  /** @type {CopyFn} */
  const copy = async text => {
    if (!navigator?.clipboard) {
      // eslint-disable-next-line no-console
      console.warn('Não há suporte para copiar para o Clipboard');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      message.success('Link copiado');
      return true;
    } catch (error) {
      message.error('Erro ao copiar link');
      // eslint-disable-next-line no-console
      console.warn('Erro ao copiar link', error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

export default useCopyToClipboard;

