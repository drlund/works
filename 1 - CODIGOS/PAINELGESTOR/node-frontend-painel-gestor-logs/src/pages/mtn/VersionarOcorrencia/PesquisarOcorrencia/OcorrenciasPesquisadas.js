import React, { useState } from 'react';
import { Space, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SearchTable from 'components/searchtable/SearchTable';
import { Link } from "react-router-dom";

const OcorrenciasPesquisadas = ({ ocorrencias }) => {
  const columns = [
    {
      title: 'Nrº Mtn',
      dataIndex: 'idMtn',
    },
    {
      title: 'Envolvido',
      render: (record, text) => {
        return `${record.matricula} - ${record.nomeFunci}`;
      },
    },
    {
      title: 'Analista',
      render: (record, text) => {
        return `${record.matRespAnalise} - ${record.nomeRespAnalise}`;
      },
    },
    {
      title: 'Medida Selecionada',
      render: (record, text) => {
        return record?.medidaSelecionada?.txtMedida;
      },
    },
    {
      title: 'Ações',
      align: 'center',
      render: (record, text) => {
        return (
          <Space align="center">
            <Tooltip title="Reverter Análise">
              <Link
                to={
                  'analisar/' +
                  record.idMtn +
                  '?matriculaEnvolvido=' +
                  record.matricula
                }
              >
                <SearchOutlined className="link-color" />
              </Link>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <SearchTable
          columns={columns}
          dataSource={ocorrencias}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </div>
    </>
  );
};

export default OcorrenciasPesquisadas;
