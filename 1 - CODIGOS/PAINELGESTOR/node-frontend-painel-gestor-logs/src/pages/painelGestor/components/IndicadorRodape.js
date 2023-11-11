import React, { useState } from 'react';
import { Typography, Button, Space, Tooltip, Popover } from 'antd';
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
  const [open, setOpen] = useState(false);

  if (!indicador) {
    return null;
  }

  const handleOpenChange = (
    /** @type {boolean | ((prevState: boolean) => boolean)} */ newOpen,
  ) => {
    setOpen(newOpen);
  };
  
  return (
    <Space align="center" style={{ marginTop: '4%' }}>
      <Typography.Text style={{ fontSize: '1.2em' }}>Detalhes:</Typography.Text>
      <Popover
        content={indicador.infoCalculo}
        title={<span style={{ fontWeight: 'bold' }}>Informações de Cálculo</span>}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Tooltip placement="bottomLeft" title="Informações de Cálculo">
          <Button
            type="default"
            size="large"
            style={estiloBotao}
            icon={<CalculatorOutlined style={estiloIcone} />}
            target="_blank"
          />
        </Tooltip>
      </Popover>
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
