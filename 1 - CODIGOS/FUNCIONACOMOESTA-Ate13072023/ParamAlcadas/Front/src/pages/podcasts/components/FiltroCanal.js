import { Col, Row} from 'antd';
import React from 'react';
import DetalhamentoCanal from './DetalhamentoCanal';
import TabelaEpisodios from './TabelaEpisodios';

/**
 * @param {{
*  canalSelecionado: Podcasts.Canal;
* }} props
*/

export default function FiltroCanal({ canalSelecionado }) {
  const medidaGrid = 16;

  return (
    <Row gutter={[medidaGrid, medidaGrid]}>
      {canalSelecionado && (
        <DetalhamentoCanal canalSelecionado={canalSelecionado} />
      )}
      <Col className="gutter-row" span={24}>
        <TabelaEpisodios canalSelecionado={canalSelecionado} />
      </Col>
    </Row>

  );
}
