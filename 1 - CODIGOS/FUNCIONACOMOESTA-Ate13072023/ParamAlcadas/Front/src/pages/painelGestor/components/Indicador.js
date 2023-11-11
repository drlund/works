import React from 'react';
import {
  Card,
  Divider,
} from 'antd';
import IndicadorRealizado from './IndicadorRealizado';
import IndicadorRodape from './IndicadorRodape';
import estilos from '../painelGestor.module.css';
import IndicadorComponentes from './IndicadorComponentes';

export default function Indicador({ indicador }) {
  if (!indicador) {
    return null;
  }

  return (
    <Card
      className={estilos.cardIndicador}
      actions={[<IndicadorRodape indicador={indicador} />]}
      bodyStyle={{ height: 650, padding: 10 }}
    >
      <IndicadorRealizado indicador={indicador} />
      <Divider />
      {<IndicadorComponentes criticidades={indicador.criticidades} />}
    </Card>
  );
}
