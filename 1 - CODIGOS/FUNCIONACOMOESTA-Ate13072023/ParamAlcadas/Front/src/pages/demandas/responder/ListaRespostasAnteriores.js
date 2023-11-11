import React, { useState } from "react";
import { Row, Col, Tooltip, Button } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import "./ListaRespostasAnteriores.css";
const ListaRespostasAnteriores = (props) => {
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);

  const columns = [
    {
      title: "Respondido Em",
      dataIndex: "dataRegistro",
      key: "dataRegistro",
      render: (text, record) => {
        return moment(record.dataRegistro).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Visualizar Resposta",
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Tooltip title="Ver Resposta">
              <EyeOutlined
                className="link-color link-cursor"
                onClick={() => {
                  props.visualizaAnterior(record);
                  setLinhaSelecionada(record._id);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        {linhaSelecionada && !props.demandaVencida && (
          <Button
            type="primary"
            onClick={() => {
              props.visualizaAnterior({});
              setLinhaSelecionada(null);
            }}
          >
            Nova resposta
          </Button>
        )}
      </Col>
      <Col span={24}>
        <SearchTable
          size="small"
          rowClassName={(record) =>
            record._id === linhaSelecionada ? "registro-ativo" : ""
          }
          columns={columns}
          dataSource={props.respostasAnteriores}
        />
      </Col>
    </Row>
  );
};

export default ListaRespostasAnteriores;
