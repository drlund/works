import { Button, Typography } from 'antd';
import React from 'react';

/**
 * @param {{
 *  dadosMassificado: import('.').DadosMassificado,
 *  setCurrent: React.Dispatch<React.SetStateAction<number>>,
 *  listaDeMatriculas: string[],
 * }} props
 */
export function ErrosDeMinuta({ dadosMassificado, setCurrent, listaDeMatriculas }) {
  return <div style={{ marginTop: '1em', marginBottom: '0.5em' }}>
    <Typography.Title level={4} style={{ color: 'red' }}>Minutas com Erros</Typography.Title>
    <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
      {dadosMassificado.hasError.map((matricula) => (
        <Button
          type="dashed"
          danger
          key={matricula}
          onClick={() => setCurrent(listaDeMatriculas.indexOf(matricula) + 1)}
        >
          {matricula}
        </Button>
      ))}
    </div>
  </div>;
}
