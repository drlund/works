import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { RedoOutlined } from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import { fetchSolicitacoesPendentesEnvio } from "services/ducks/Encantar.ducks";
import { SendOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./entregas.module.scss";

const columns = [
  { title: "Id", dataIndex: "id" },
  {
    title: "MCI",
    dataIndex: "mci",
  },
  {
    title: "Cliente",
    dataIndex: "nomeCliente",
  },
  {
    title: "Solicitante",
    dataIndex: "solicitante",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Ações",
    width: "10%",
    align: "center",
    render: (text, record) => {
      return (
        <Tooltip title="Registrar Envio">
          <Link to={`/encantar/envio/${record.id}`}>
            <SendOutlined className="link-color" />
          </Link>
        </Tooltip>
      );
    },
  },
];

const SolicitacoesPendentesEnvio = (props) => {
  const [pendenciasEnvio, setPendenciasEnvio] = useState(null);

  const getSolicitacoesPendentesEnvio = useCallback(() => {
    return fetchSolicitacoesPendentesEnvio();
  }, []);

  useEffect(() => {
    if (pendenciasEnvio === null) {
      getSolicitacoesPendentesEnvio()
        .then((pendentesEnvio) => {
          setPendenciasEnvio(pendentesEnvio);
        })
        .catch(() => {
          message.error("Erro ao recuperar pendentes de envio");
        });
    }
  }, [pendenciasEnvio, getSolicitacoesPendentesEnvio]);

  return (
    <BBSpinning spinning={pendenciasEnvio === null}>
      <Col span={24}>
        <div className={styles.refreshButtonWrapper}>
          <Button
            loading={pendenciasEnvio === null}
            icon={<RedoOutlined />}
            onClick={() => setPendenciasEnvio(null)}
            style={{ marginBottom: "15px", marginRight: "25px" }}
          />
        </div>
      </Col>
      <Row>
        <Col span={24}>
          <SearchTable
            columns={columns}
            dataSource={pendenciasEnvio}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default SolicitacoesPendentesEnvio;
