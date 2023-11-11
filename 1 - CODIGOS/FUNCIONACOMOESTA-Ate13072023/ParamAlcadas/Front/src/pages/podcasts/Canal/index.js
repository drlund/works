import { Button, Card, Col, Result, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCanal } from '../apiCalls/apiPodcasts';
import DetalhamentoCanal from '../components/DetalhamentoCanal';
import TabelaEpisodios from '../components/TabelaEpisodios';
import { ArrowLeftOutlined } from '@ant-design/icons';


export default function Canal({
  match: {
    params: { idCanal },
  },
}) {
  const [canalSelecionado, setCanalSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCanal(idCanal)
      .then((resposta) => {
        setCanalSelecionado(resposta);
      })
      .catch(() => message.error('Não foi possível localizar este canal.'))
      .finally(() => setLoading(false));
  }, []);
  const medidaGrid = 16;

  return canalSelecionado ? (
      <Row gutter={[medidaGrid, medidaGrid]}>
        <Col span={24}>
          <Card loading={loading}>
            <DetalhamentoCanal canalSelecionado={canalSelecionado[0]} />
            <Col span={24}>
              <TabelaEpisodios canalSelecionado={canalSelecionado[0]} />
            </Col>
            <Col>
              <Button
                type="link"
                href={`${process.env.PUBLIC_URL}/podcasts/`}
              >
                <ArrowLeftOutlined />
                Home Podcasts
              </Button></Col>
          </Card>
        </Col>
      </Row>
  ) :
    <Card loading={loading}>
      <Result
        status="404"
        title="Canal não localizado"
        subTitle="O canal indicado não foi encontrado, verifique o código informado."
        extra={<Button
          type="primary"
          href={`${process.env.PUBLIC_URL}/podcasts/`}
          style={{ color: '#fff' }}
        >
          Home Podcasts
        </Button>}
      />
    </Card>;
}
