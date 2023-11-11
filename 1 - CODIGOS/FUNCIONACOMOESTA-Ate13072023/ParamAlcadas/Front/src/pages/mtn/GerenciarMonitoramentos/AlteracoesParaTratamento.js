import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
import { ReloadOutlined, FileDoneOutlined } from "@ant-design/icons";

import SearchTable from "components/searchtable/SearchTable";
import { fetchAlteracoesParaTratamento } from "services/ducks/MtnComite.ducks";
import styles from "./Commons.module.scss";
import history from "history.js";

const AlteracoesParaTratamento = (props) => {
  const { loadingController } = props;
  const { setLoading } = loadingController;
  const [pedidosAlteracaoParaTratamento, setPedidosAlteracaoParaTratamento] =
    useState([]);

  const onFetchAlteracoesParaTratamento = useCallback(() => {
    setLoading(true);
    fetchAlteracoesParaTratamento()
      .then((fetchedAlteracoesParaTratamento) => {
        setPedidosAlteracaoParaTratamento(fetchedAlteracoesParaTratamento);
      })
      .catch(() => {
        message.error("Erro ao recuperar lista de parâmetros para tratamento.");
      })
      .then(() => {
        setLoading(false);
      });
  }, [setLoading]);

  useEffect(() => {
    onFetchAlteracoesParaTratamento();
  }, [onFetchAlteracoesParaTratamento]);

  const columns = [
    { title: "Id", dataIndex: "id" },
    { title: "Criado em", dataIndex: "createdAt" },
    {
      title: "Incluido Por",
      dataIndex: "nome",
      render: (record, text) => {
        return <p>{`${text.incluidoPor} - ${text.incluidoPorNome}`}</p>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Tratar",
      align: "center",
      render: (record, text) => {
        return (
          <Tooltip title={"Tratar pedido de alteração dos parâmetros"}>
            <FileDoneOutlined
              className={styles.acoesIcon}
              onClick={() =>
                history.push(
                  `/mtn/monitoramento/tratar-alteracao-parametros/${record.id}`
                )
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
        <div className={styles.extraTableUpdate}>
          <Button
            icon={<ReloadOutlined />}
            onClick={onFetchAlteracoesParaTratamento}
          />
        </div>
      </Col>
      <Col span={24}>
        <SearchTable
          columns={columns}
          dataSource={pedidosAlteracaoParaTratamento}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </Col>
    </Row>
  );
};

export default AlteracoesParaTratamento;
