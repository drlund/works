import React from 'react';
import {
  Typography,
  Button,
  Space,
  Tooltip,
} from 'antd';
import {
  CalculatorOutlined,
  ProjectOutlined,
  ReadOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { getHumanGramURL } from 'utils/Commons';

export default function IndicadorRodape({ indicador }) {
  const estiloBotao = { borderRadius: '7px' };
  const estiloIcone = { fontWeight: 'bold', fontSize: '1.3em' };

  if (!indicador) {
    return null;
  }

  return (
    <Space align="center" style={{ marginTop: '4%' }}>
      <Typography.Text style={{ fontSize: '1.2em' }}>Detalhes:</Typography.Text>
      <Tooltip placement="topLeft" title="Informações de Cálculo">
        <Button
          type="default"
          size="large"
          style={estiloBotao}
          icon={<CalculatorOutlined style={estiloIcone} />}
          // => Desabilitado: Aguardando Informações oriundas do Gestor do componente.
          // href={indicador.infoCalculo}
          target="_blank"
        />
      </Tooltip>
      <Tooltip placement="top" title="Relatório">
        <Button
          type="default"
          size="large"
          style={estiloBotao}
          icon={<ProjectOutlined style={estiloIcone} />}
          href={indicador.relatorio}
          target="_blank"
        />
      </Tooltip>
      <Tooltip placement="top" title="Material de Apoio">
        <Button
          type="default"
          size="large"
          style={estiloBotao}
          icon={<ReadOutlined style={estiloIcone} />}
          href={indicador.materialApoio}
          target="_blank"
        />
      </Tooltip>
      <Tooltip placement="topRight" title="Evolução">
        <Button
          disabled
          type="default"
          size="large"
          style={estiloBotao}
          icon={<LineChartOutlined style={estiloIcone} />}
          href={indicador.grafEvolucao}
          target="_blank"
        />
      </Tooltip>
      <Tooltip placement="topRight" title="Equipe Responsável">
        <Button
          type="default"
          size="large"
          style={estiloBotao}
          icon={<QuestionCircleOutlined style={estiloIcone} />}
          href={getHumanGramURL(indicador.uorResponsavel, 'uor/')}
          target="_blank"
        />
      </Tooltip>
    </Space>
  );
}
