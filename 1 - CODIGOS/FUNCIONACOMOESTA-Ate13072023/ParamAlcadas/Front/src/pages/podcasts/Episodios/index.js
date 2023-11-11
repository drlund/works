import { Button, Col, Row, Select, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchCanais } from '../apiCalls/apiPodcasts';
import FiltroCanal from '../components/FiltroCanal';


export default function Episodios() {
  const [canais, setCanais] = useState([]);
  const [selected, setSelected] = useState();
  const [canalSelecionado, setCanalSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCanais()
      .then(setCanais)
      .catch((error) => {
        message.error(error.response.data);
      })
      .finally(() => setLoading(false));
  }, []);


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
        </Space>
      </Col>
      <Col>
        <FiltroCanal canalSelecionado={canalSelecionado} />
      </Col>
    </Row>
  );
}
