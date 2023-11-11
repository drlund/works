import { Input } from 'antd';
import React, { useState } from 'react';

// do texto, retorna uma lista de matriculas
// antes de cada matricula aceita o começo da linha ou não letra ou numero
// depois de cada matricula aceita final de linha ou não letra ou numero
const extractListaDeMatriculas = /** @param {string} text */ (text) =>
  Array
    .from(text?.match(/(?<=^|[^a-z0-9])f\d{7}(?=$|[^a-z0-9])/gmi) ?? [])
    .map((m) => m.toUpperCase());

/**
 * @param {{
*  handleOnSearch: (value: string[], cb?: Function) => void
* }} props
*/
export function MatriculasTextArea({ handleOnSearch }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  /**
   * @param {{target: { value: string }}} e
   */
  const handleText = ({ target: { value } }) => {
    setError(false);
    const matriculas = extractListaDeMatriculas(value);

    if (matriculas.length > 0) {
      handleOnSearch(
        matriculas,
        () => setText("")
      );
    } else if (value.trim().length > 0) {
      setError(true);
    }
  };

  return (
    <Input.TextArea
      placeholder={'Lista de Matrículas\n\nDesde que as matriculas estejam separadas por qualquer coisa, irá extrair\n\nEx: f1234567 F2345678,f3456789'}
      rows={10}
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
