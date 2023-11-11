import React, { useEffect, useState } from 'react';
import {
  Col,
  Progress,
  Row,
  Typography,
} from 'antd';

export default function IndicadorRealizado({ indicador }) {
  const [corGraficoIndicador, setCorGraficoIndicador] = useState(null);

  if (!indicador) {
    return null;
  }

  useEffect(() => {
    if (indicador.percentualAtingimento < 100) {
      const detalheComponente = indicador.criticidades.find((criticidade) =>
        criticidade.componentes.find(
          (detalheData) => detalheData.valorComponente > 0,
        ),
      );
      setCorGraficoIndicador(detalheComponente?.codigoCor);
    }
  }, []);

  return (
    <Row gutter={8} justify="space-around">
      <Col
        span={12}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          padding: 0,
        }}
      >
        <Progress
          type="circle"
          percent={indicador.percentualAtingimento}
          strokeColor={corGraficoIndicador}
        />
        <Typography.Text
          style={{ width: '100%', fontSize: '1.4em', textAlign: 'center' }}
        >
          {/* <Space> */}
          Realizado
          {/* comentado pq tenho quase certeza que vão pedir pra voltar a informação
              <Tooltip
                title={`Pontos: ${
                  indicador.pontosIndicador,
                )}/${indicador.maxPontosIndicador} máx;  Peso: ${
                  indicador.pesoIndicador
                }`}
                placement="top"
              >
                <InfoCircleOutlined style={{ fontSize: '0.8em' }} />
              </Tooltip> */}
          {/* </Space> */}
        </Typography.Text>
      </Col>
      <Col
        span={12}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px 0px',
          padding: 0,
        }}
      >
        <Typography.Text
          style={{ width: '100%', fontSize: '1.6em', fontWeight: 'bold' }}
        >
          {indicador.nomeIndicador}
        </Typography.Text>

        {/* comentado pq tenho quase certeza que vão pedir pra voltar a informação
          <Typography.Text style={{ width: '100%', fontSize: '1.1em' }}>
            Participação {
              <Tooltip
                title="Participação do indicador na pontuação do prefixo"
                placement="top"
              >
                <InfoCircleOutlined/>
              </Tooltip>
            } : {indicador.participacao}
          </Typography.Text> 
          <Typography.Text style={{ width: '100%', fontSize: '1em' }}>
            <CalendarOutlined />
            Posição: {indicador.dataAtualizacao}
          </Typography.Text>*/}

        <Typography.Text style={{ width: '100%', fontSize: '1.1em' }}>
          Pontos:{' '}
          {`${indicador.pontosIndicador} /
              ${indicador.maxPontosIndicador}`}{' '}
          máx
        </Typography.Text>
        <Typography.Text style={{ width: '100%', fontSize: '1.1em' }}>
          Peso: {indicador.pesoIndicador}
        </Typography.Text>
        <Typography.Text style={{ width: '100%', fontSize: '1.1em' }}>
          Média Brasil: {indicador.media}%
        </Typography.Text>
      </Col>
    </Row>
  );
}
