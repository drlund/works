import React, { useMemo } from 'react';
import {
  Progress,
  Row,
  Table,
  Typography,
  Space,
  Tooltip,
  Collapse,
} from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { getPercentualAtingimento } from '../commons/CommonsFunctions';

const { Panel } = Collapse;

export default function IndicadorComponentes({ criticidades }) {
  if (!criticidades) {
    return null;
  }

  return (
    <Row>
      <Collapse
        accordion
        style={{ width: '100%' }}
        // comentado pq tenho quase certeza que vão pedir pra voltar a informação
        // defaultActiveKey={indicador.criticidades[0].idCriticidade}
      >
        {criticidades.map((criticidade) => (
          <Panel
            key={criticidade.idCriticidade}
            header={(
              <Typography.Text
                style={{
                  color: `${criticidade.codigoCor}`,
                  fontSize: '1.4em',
                  fontFamily: 'Calibri',
                }}
                >
                <Space>
                  <Progress
                    key={criticidade.idCriticidade}
                    type="circle"
                    format={(percent) => {
                      (
                        <span
                          style={{ color: criticidade.codigoCor }}
                        >
                          {`${percent}%`}
                        </span>
                      );
                    }}
                    percent={getPercentualAtingimento(criticidade)}
                    strokeColor={criticidade.codigoCor}
                    align="center"
                    width={30}
                    status="normal"
                    />
                  {criticidade.descricaoCriticidade}
                </Space>
              </Typography.Text>
              )}
            extra={(
              <Typography.Text
                style={{
                  color: `${criticidade.codigoCor}`,
                  fontSize: '1.4em',
                  fontFamily: 'Calibri',
                }}
                >
                {criticidade.componentes.reduce(
                  (acumulador, atual) => acumulador + atual.valorComponente,
                  0
                ).toLocaleString('pt-BR')}
              </Typography.Text>
              )}
            >
            <Table
              rowKey={(record) => `row-${record.nomeComponente}`}
              style={{ height: '230px' }}
              pagination={false}
              dataSource={criticidade.componentes}
              columns={[
                {
                  title: 'Componentes',
                  dataIndex: 'nomeComponente',
                  key: 'nomeComponente',
                  render: (text, record) => (
                    <Tooltip
                      placement="top"
                      title={`Posição: ${record.posicaoComponente}`}
                    >
                      <CalendarOutlined style={{ marginRight: '8px' }}/>
                      {text}
                    </Tooltip>
                  ),
                },
                {
                  dataIndex: 'valorComponente',
                  key: 'valorComponente',
                  render: (value) => (
                    <Typography.Text>
                      {value.toLocaleString('pt-BR')}
                    </Typography.Text>
                  )
                },
              ]}
            />
          </Panel>
        ))}
      </Collapse>
    </Row>
  );
}
