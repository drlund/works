import React, { useEffect, useState } from "react";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { RedoOutlined } from "@ant-design/icons";
import { Row, Col, Button, Tooltip } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import { SwapOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { fetchSolicitacoesDevolvidas } from "services/ducks/Encantar.ducks";
import styles from "./entregas.module.scss";

const SolicitacoesDevolvidas = (props) => {
  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchSolicitacoesDevolvidas().then((solicitacoesFetched) => {
      setSolicitacoes(solicitacoesFetched);
      setLoading(false);
    });
  }, []);

  const columns = [
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
      dataIndex: "cliente",
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
          <Tooltip title="Tratar devolução">
            <Link to={`/encantar/tratar-devolucao/${record.id}`}>
              <SwapOutlined className="link-color" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Row>
      <Col>
        <BBSpinning spinning={loading}>
          <Col span={24}>
            <div className={styles.refreshButtonWrapper}>
              <Button
                loading={loading}
                icon={<RedoOutlined />}
                onClick={() => console.log("refesh")}
                style={{ marginBottom: "15px", marginRight: "25px" }}
              />
            </div>
          </Col>
          <Row>
            <Col span={24}>
              <SearchTable
                columns={columns}
                dataSource={solicitacoes}
                size="small"
                pagination={{ showSizeChanger: true }}
              />
            </Col>
          </Row>
        </BBSpinning>
      </Col>
    </Row>
  );
};

export default SolicitacoesDevolvidas;
