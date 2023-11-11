import React from 'react';
import { css } from 'styled-components';

/**
 * highlight dos campos de outorgado (que é o que vai mudar de minuta a minuta),
 * mostrando apenas neste momento de conferencia e alteração de dados
 *
 * styled components estava quebrando o tinymce
 * ou então simplesmente não funcionando, então deixei como style jsx
*/
export const HighlightOutorgado = () => <style>{/** @type {string} */( /** @type {unknown} */(css`
[data-minuta-ok^="outorgado"] {
  border-radius: 10%;
  background-color: #f8f88888;
  padding: 0.2em;
}
`))}</style>;
