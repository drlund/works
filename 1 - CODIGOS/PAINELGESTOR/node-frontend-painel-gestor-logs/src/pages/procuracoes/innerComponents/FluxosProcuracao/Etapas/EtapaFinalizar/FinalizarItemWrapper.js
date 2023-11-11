import { Button } from 'antd';
import React, { useState } from 'react';

/**
 * @param {{
 *  icon: React.ReactNode,
 *  text: string,
 *  detalhesAppend: string,
 *  children: React.ReactNode,
 * }} props
*/
export function FinalizarItemWrapper({
  icon, text, detalhesAppend, children
}) {
  const [display, setDisplay] = useState(false);
  const detalhesText = display ? `Esconder Detalhes ${detalhesAppend}` : `Mais Detalhes ${detalhesAppend}`;

  const handleClick = () => setDisplay(!display);

  return (
    <>
      {icon}
      <h4>{text}</h4>
      <Button
        type="link"
        onClick={handleClick}
        style={{ fontSize: '0.9em', paddingLeft: 0 }}
      >
        {detalhesText}
      </Button>
      <div style={{
        visibility: display ? 'visible' : 'collapse',
        height: display ? 'unset' : 0
      }}>
        {children}
      </div>
    </>
  );
}
