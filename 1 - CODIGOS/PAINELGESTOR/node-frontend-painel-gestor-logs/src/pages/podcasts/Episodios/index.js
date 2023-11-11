import { Button, Col, Row, Select, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchCanais, fetchCanaisSeguidos } from '../apiCalls/apiPodcasts';
import FiltroCanal from '../components/FiltroCanal';

export default function Episodios({ canalDetalhamento = null }) {
  const [canais, setCanais] = useState(/** @type {Podcasts.Canal[]} */([]));
  const [selected, setSelected] = useState();
  const [canalSelecionado, setCanalSelecionado] = useState(/** @type {Podcasts.Canal|null} */(null));
  // TODO: lidar com estado de loading
  const [loading, setLoading] = useState(false);
  // TODO: implementar filtro
  const [check, setCheck] = useState(false);
  const [canaisSeguidos, setCanaisSeguidos] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchCanais()
      .then(setCanais)
      .catch((error) => {
        message.error(error.response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCanaisSeguidos()
      .then(setCanaisSeguidos)
      .catch((error) => {
        message.error(error.response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (canalDetalhamento) {
      const canal = canais.find((c) => c.nome === canalDetalhamento);
      setCanalSelecionado(canal);
    }
  });

  const clearSelected = () => {
    setSelected(null);
    setCanalSelecionado(null);
  };

  const selectCanal = () => {
    if (selected) {
      const canal = canais.find((c) => c.id === selected);
      setCanalSelecionado(canal);
    }
  };

  const selectOptions = canais.map((canal) => ({
    value: canal.id,
    label: canal.nome,
  }));
  // const vida = true;
  const medidaGrid = 16;

  return (
    <Row gutter={[medidaGrid, medidaGrid]}>
      <Col className="gutter-row" span={24}>
        <Space direction="horizontal" size="small">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            style={{ width: 200 }}
            placeholder="Selecione um canal"
            options={selectOptions}
            value={selected}
            onChange={(value) => setSelected(value)}
          />
          <Button type="primary" onClick={selectCanal}>
            Filtrar
          </Button>
          <Button
            // @ts-ignore
            type="secondary" onClick={clearSelected}>
            Limpar
          </Button>
          {/* CHECKBOX AQUI */}
          {/* <Checkbox onChange={selectCanaisSeguidos}>Canais Seguidos</Checkbox> */}
        </Space>
      </Col>
      <Col>
        <FiltroCanal canalSelecionado={canalSelecionado} check={check} canaisSeguidos={canaisSeguidos} />
      </Col>
    </Row>
  );
}
