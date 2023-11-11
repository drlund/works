import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, Tooltip } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { RedoOutlined } from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import { fetchSolicitacoesPendentesEntrega } from "services/ducks/Encantar.ducks";
import { DownloadOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

import styles from "./entregas.module.scss";

const columns = [
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
        <Tooltip title="Registrar Recebimento">
          <Link to={`/encantar/entrega-cliente/${record.id}`}>
            <DownloadOutlined className="link-color" />
          </Link>
        </Tooltip>
      );
    },
  },
];

const SolicitacoesPendentesEntregaCliente = (props) => {
  const [
    pendenciasRecebimentoCliente,
    setPendenciasRecebimentoCliente,
  ] = useState(null);

  const getSolicitacoesPendentesEntrega = useCallback(() => {
    return fetchSolicitacoesPendentesEntrega();
  }, []);

  useEffect(() => {
    if (pendenciasRecebimentoCliente === null) {
      getSolicitacoesPendentesEntrega().then((pendentesEntrega) => {
        setPendenciasRecebimentoCliente(pendentesEntrega);
      });
    }
  }, [pendenciasRecebimentoCliente, getSolicitacoesPendentesEntrega]);

  return (
    <BBSpinning spinning={pendenciasRecebimentoCliente === null}>
      <Col span={24}>
        <div className={styles.refreshButtonWrapper}>
          <Button
            loading={pendenciasRecebimentoCliente === null}
            icon={<RedoOutlined />}
            onClick={() => setPendenciasRecebimentoCliente(null)}
            style={{ marginBottom: "15px", marginRight: "25px" }}
          />
        </div>
      </Col>
      <Row>
        <Col span={24}>
          <SearchTable
            columns={columns}
            dataSource={pendenciasRecebimentoCliente}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default SolicitacoesPendentesEntregaCliente;
