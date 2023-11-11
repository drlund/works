import React from "react";
import { Row, Col } from "antd";
import SearchTable from "components/searchtable/SearchTable";

const HistoricoVersoes = (props) => {
  const { versoes } = props;

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Incluído Por",
      render: (text, record) => {
        return <p>{`${record.incluido_por} - ${record.incluido_por_nome}`}</p>;
      },
    },
    {
      title: "Status",
      render: (text, record) => {
        return <p>{record.status.display}</p>;
      },
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <SearchTable columns={columns} dataSource={versoes} />
      </Col>
    </Row>
  );
};

export default HistoricoVersoes;
