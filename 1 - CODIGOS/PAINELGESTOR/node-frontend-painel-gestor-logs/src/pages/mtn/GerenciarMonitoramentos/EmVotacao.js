import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, message, Tooltip, Space, Modal } from "antd";
import {
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import styles from "./Commons.module.scss";
import {
  fetchMonitoramentosEmVotacao,
  excluirVotacao,
} from "services/ducks/MtnComite.ducks";
import history from "history.js";

const { confirm } = Modal;

const Finalizadas = (props) => {
  const [monitoramentos, setMonitoramentos] = useState([]);

  const { loadingController } = props;
  const { setLoading } = loadingController;

  const onExcluirVotacao = (idMonitoramento) => {
    setLoading(true);
    excluirVotacao(idMonitoramento)
      .then(() => {
        message.success("Votação excluída");
      })
      .catch((error) => {
        const msg = error.msg ? error : "Erro ao excluir votação.";
        message.error(msg);
      })
      .then(() => {
        setLoading(false);
        onFetchMonitoramentosEmVotacao();
      });
  };

  const onFetchMonitoramentosEmVotacao = useCallback(() => {
    setLoading(true);
    fetchMonitoramentosEmVotacao()
      .then((fetchedMonitoramentos) => {
        setMonitoramentos(fetchedMonitoramentos);
      })
      .catch((error) => {
        message.error(
          "Erro ao recuperar lista de monitoramentos com votação em andamento."
        );
      })
      .then(() => {
        setLoading(false);
      });
  }, [setLoading]);

  const showDeleteConfirm = (idMonitoramento) => {
    confirm({
      title: "Tem certeza que deseja excluir essa votação?",
      icon: <ExclamationCircleOutlined />,
      content: `Essa operação é irreversível e irá desconsiderar todos os votos já registrados. O parâmetro vigente passará a ser aquele que estava ativo no momento da inclusão desta votação.`,
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        onExcluirVotacao(idMonitoramento);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    onFetchMonitoramentosEmVotacao();
  }, [onFetchMonitoramentosEmVotacao]);

  const columns = [
    { title: "Id", dataIndex: "id" },
    { title: "Nome Reduzido", dataIndex: "nomeReduzido" },
    { title: "Nome", dataIndex: "nome" },
    { title: "Descrição", dataIndex: "descricao" },
    { title: "Criado em", dataIndex: "createdAt" },
    {
      title: "Ações",
      align: "center",
      render: (record, text) => {
        return (
          <Space>
            <Tooltip title={"Excluir Votação"}>
              <DeleteOutlined
                className={styles.deleteIcon}
                onClick={() => showDeleteConfirm(record.id)}
              />
            </Tooltip>
            <Tooltip title={"Visualizar Votação"}>
              <EyeOutlined
                className={styles.acoesIcon}
                onClick={() =>
                  history.push(
                    `/mtn/monitoramento/consultar-votacao/${record.id}`
                  )
                }
              />
            </Tooltip>
          </Space>
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
            onClick={onFetchMonitoramentosEmVotacao}
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

export default Finalizadas;
