import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
import { ReloadOutlined, FileDoneOutlined } from "@ant-design/icons";

import SearchTable from "components/searchtable/SearchTable";
import { fetchMonitoramentosParaNovaVersao } from "services/ducks/MtnComite.ducks";
import styles from "./Commons.module.scss";

import history from "history.js";

const Aprovados = (props) => {
  const { loadingController } = props;
  const { setLoading } = loadingController;
  const [monitoramentos, setMonitoramentos] = useState([]);

  const onFetchMonitoramentosParaNovaVersao= useCallback(() => {
    setLoading(true);
    fetchMonitoramentosParaNovaVersao()
      .then((fetchedMonitoramentos) => {
        setMonitoramentos(fetchedMonitoramentos);
      })
      .catch((error) => {
        message.error(
          "Erro ao recuperar lista de monitoramentos para votação."
        );
      })
      .then(() => {
        setLoading(false);
      });
  }, [setLoading]);

  useEffect(() => {
    onFetchMonitoramentosParaNovaVersao();
  }, [onFetchMonitoramentosParaNovaVersao]);

  const columns = [
    { title: "Id", dataIndex: "id" },
    { title: "Nome Reduzido", dataIndex: "nomeReduzido" },
    { title: "Nome", dataIndex: "nome" },
    { title: "Status", dataIndex: "status" },
    { title: "Criado em", dataIndex: "createdAt" },
    {
      title: "Ações",
      align: "center",
      render: (record, text) => {
        return (
          <Tooltip title={"Incluir votação"}>
            <FileDoneOutlined
              className={styles.acoesIcon}
              onClick={() =>
                history.push(`/mtn/incluir-votacao-monitoramento/${record.id}`)
              }
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <div className={styles.extrasTableWrapper}>          
          <Button
            icon={<ReloadOutlined />}
            onClick={onFetchMonitoramentosParaNovaVersao}
          />
        </div>
      </Col>
      <Col span={24}>
        <SearchTable
          columns={columns}
          dataSource={monitoramentos}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </Col>
    </Row>
  );
};

export default Aprovados;
