import React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
// eslint-disable-next-line import/no-unresolved, import/extensions
import history from '@/history.js';

const columnsVisaoMtn = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: 10,
  },
  {
    title: 'Nr. MTN',
    dataIndex: 'nrMtn',
    width: 10,
  },
  {
    title: 'Envolvido',
    dataIndex: 'envolvido',
    width: 250,
  },
  {
    title: 'Prefixo',
    dataIndex: 'prefixo',
    width: 100,
  },
  {
    title: 'Visão',
    dataIndex: 'visao',
    width: 100,
  },
  {
    title: 'Data Criação',
    dataIndex: 'dataCriacao',
    width: 10,
  },
  {
    title: 'Qtde Analises',
    dataIndex: 'qtdAnalises',
    align: 'center',
    width: 10,
  },
  {
    title: 'Qtde Fora Prazo',
    dataIndex: 'qtdForaPrazo',
    align: 'center',
    width: 10,
  },
  {
    title: 'BB Atende',
    dataIndex: 'bbAtende',
    align: 'center',
    width: 10,
  },
    {
    title: 'Medida',
    dataIndex: 'medida',
    align: 'center',
    width: 10,
  },
  {
    title: 'Ações',
    align: 'center',
    render: (text, record) => (
      <Tooltip key={record.id} title="Visualizar Análise">
        <EyeOutlined
          className="link-color"
          onClick={() => {
            history.push(`/mtn/analisar/${record.id}`);
          }}
        />
      </Tooltip>
    ),
    width: 10,
  },
];

export default columnsVisaoMtn;
