import React from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Table, Empty, Tooltip } from "antd";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Nr. MTN",
    dataIndex: "nrMtn",
    key: "nrMtn",
  },
  {
    title: "Visão",
    dataIndex: "visao",
  },
  {
    title: "Resultado da Análise",
    dataIndex: "sancao",
    align: "center",
    key: "sancao",
  },
  {
    title: "Dt. Análise",
    dataIndex: "dataAnalise",
    align: "center",
    key: "dataAnalise",
  },
  {
    title: "Situação",
    dataIndex: "situacao",
    key: "situacao",
  },

  {
    title: "Ações",
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Reservar">
          <Link to={`/mtn/analisar/${record.idMtn}`} target="_blank">
            <EyeOutlined className="link-color" />
          </Link>
        </Tooltip>
      );
    },
  },
];

export default function MtnEnvolvidoHistorico(props) {
  return (
    <div>
      <Table
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>Nenhum MTN</span>}
            />
          ),
        }}
        columns={columns}
        dataSource={props.data}
        size="small"
      />
    </div>
  );
}
