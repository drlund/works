import { Input } from 'antd';
import React, { useState } from 'react';

/**
 * aceita emails do bb, ou então escrevendo o email terminando ou começando em '@'
 */
const emailRegex = /\B@(?<handleA>[\w.]*)\b|(?<handleB>[\w.]*)@bb\.com\.br|\b(?<handleC>[\w.]*)@\B/gmi;

/**
 * De um texto que contem emails ou handles de email, se extrai tudo e se cria os emails `handle@bb.com.br`
 */
const extractEmails = /** @param {string} text */ (text) => {
  const extractedHandles = Array.from(text.matchAll(emailRegex))
    .map(m => Object
      // do regex, extrai os groups
      .values(/** @type {Record<string,string>} */(m.groups))
      // para cada resultado, apenas um group não é undefined
      // então se remove os valores nulos
      .filter(Boolean)
    )
    // o resultado neste ponto é um array de arrays, então se faz o flatten
    .flat(Infinity);

  // como é possível ter valores duplicados, é feito o dedupe e criação dos emails
  return Array.from(new Set(extractedHandles))
    .map((s) => `${s}@bb.com.br`);
};

/**
 * @param {{
*  handleOnSearch: (value: string[], cb?: Function) => void
* }} props
*/
export function EmailsTextArea({ handleOnSearch }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  /**
   * @param {{target: { value: string }}} e
   */
  const handleText = ({ target: { value } }) => {
    setError(false);
    const emails = extractEmails(value);

    if (emails.length > 0) {
      handleOnSearch(
        emails,
        () => setText("")
      );
    } else if (value.trim().length > 0) {
      setError(true);
    }
  };

  return (
    <Input.TextArea
      placeholder={
        'Lista de Emails\n\nDesde que as emails estejam separadas por qualquer coisa, irá extrair.\n\nÉ possível também colar apenas a parte inicial sem o "bb.com.br"\n\nEx: nome@bb.com.br nome@,@nome'
      }
      rows={15}
      value={text}
      status={error ? 'warning' : ''}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleText}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          // @ts-ignore
          handleText(e);
        }
      }}
    />
  );
}
