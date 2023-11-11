import React from "react";
import { Table, Tooltip } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const commonColumns = [
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "MCI",
    dataIndex: "mci",
  },
  {
    title: "Cliente",
    render: (record, text) => {
      return `${record.nomeCliente}`;
    },
  },
  {
    title: "Solicitante",
    render: (record, text) => {
      return `${record.matriculaSolicitante} - ${record.nomeSolicitante}`;
    },
  },
  {
    title: "Status",
    render: (record, text) => {
      return `${record.status.descricao}`;
    },
  },
  {
    title: "Data Solicitação",
    dataIndex: "createdAt",
  },
  {
    title: "Ações",
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Registrar Reação">
          <Link to={`/encantar/reacao/${record.id}`}>
            <EyeOutlined className="link-color" />
          </Link>
        </Tooltip>
      );
    }
  },
];

const TabelaSolicitacoesParaReacao = (props) => {
  const { solicitacoesParaReacao, loading } = props;

  return (
    <Table
      columns={commonColumns}
      dataSource={solicitacoesParaReacao}
      loading={loading}
    />
  );
};

export default TabelaSolicitacoesParaReacao;
