import { Col, Row } from 'antd';
import React from 'react';
import DetalhamentoCanal from './DetalhamentoCanal';
import TabelaEpisodios from './TabelaEpisodios';

/**
 * @param {{
 *  canalSelecionado: Podcasts.Canal;
 *  check: boolean;
 *  canaisSeguidos: unknown;
 * }} props
 */
export default function FiltroCanal({ canalSelecionado, check, canaisSeguidos }) {
  const medidaGrid = 16;

  return (
    <Row gutter={[medidaGrid, medidaGrid]}>
      {canalSelecionado && (
        <DetalhamentoCanal canalSelecionado={canalSelecionado} />
      )}
      <Col className="gutter-row" span={24}>
        <TabelaEpisodios canalSelecionado={canalSelecionado} check={check} canaisSeguidos={canaisSeguidos} />
      </Col>
    </Row>
  );
}
