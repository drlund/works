import React from 'react';
import ReactHtmlParser from 'react-html-parser'

export const TextoCabec = (props) => {

  const texto = ReactHtmlParser(props.texto.texto);

  return (
    <div>
      {texto}
    </div>
  );
}

export default TextoCabec;