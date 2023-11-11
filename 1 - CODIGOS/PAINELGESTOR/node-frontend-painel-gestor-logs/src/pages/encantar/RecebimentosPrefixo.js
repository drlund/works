import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { RedoOutlined } from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import { fetchSolicitacoesPendentesRecebimento } from "services/ducks/Encantar.ducks";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./entregas.module.scss";

const commonColumns = [
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
        <span>
          <Link to={`/encantar/recebimento/${record.id}`}>
            <EyeOutlined className="link-color" />
          </Link>
        </span>
      );
    },
  },
];

const RecebimentosPrefixo = (props) => {
  const [pendencias, setPendencias] = useState(null);

  const getSolicitacoesPendentesRecebimento = useCallback(() => {
    return fetchSolicitacoesPendentesRecebimento();
  },[]);

  useEffect(() => {
    if (pendencias === null) {
      getSolicitacoesPendentesRecebimento().then(
        (pendentesRecebimento) => {
          setPendencias(pendentesRecebimento);
        }
      );
    }
  }, [pendencias, getSolicitacoesPendentesRecebimento]);

  return (
    <BBSpinning spinning={pendencias === null}>
      <Col span={24}>
        <div className={styles.refreshButtonWrapper}>
          <Button
            loading={pendencias === null}
            icon={<RedoOutlined />}
            onClick={() => setPendencias(null)}
            style={{ marginBottom: "15px", marginRight: "25px" }}
          />
        </div>
      </Col>
      <Row>
        <Col span={24}>
          <SearchTable
            columns={commonColumns}
            dataSource={pendencias}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default RecebimentosPrefixo;
