import React, { useState, useEffect, useCallback } from "react";
import SearchTable from "components/searchtable/SearchTable";
import { message, Row, Col, Button, Modal, Tabs } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import {
  fetchSolicitacoesAndamento,
  fetchSolicitacao,
  salvarCancelamento,
} from "services/ducks/Encantar.ducks";
import BBSpining from "components/BBSpinning/BBSpinning";
import { Link } from "react-router-dom";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./solicitacoesAndamento.module.scss";
import DadosSolicitacao from "./DadosSolicitacao";
import FormCancelarSolicitacacao from "./FormCancelarSolicitacao";
import { verifyPermission } from "utils/Commons";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;


const CancelarSolicitacao = (props) => {
  const { idSolicitacao, getSolicitacoesAndamento } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitacao, setSolicitacao] = useState(null);

  const onSalvarCancelamento = (dadosCancelamento) => {
    setLoading(true);
    salvarCancelamento(dadosCancelamento)
      .then(() => {
        setShowModal(false);
        getSolicitacoesAndamento();
      })
      .catch((error) => {
        message.error(error);
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showModal === true) {
      setLoading(true);
      fetchSolicitacao(idSolicitacao)
        .then((dadosSolicitacao) => {
          setSolicitacao(dadosSolicitacao);
        })
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [showModal, idSolicitacao]);

  return (
    <>
      <DeleteOutlined
        onClick={() => setShowModal(true)}
        className={styles.deleteButton}
      />

      <Modal
        width={1000}
        maskClosable={!loading}
        closable={!loading}
        footer={
          <Button
            type="primary"
            loading={loading}
            onClick={() => setShowModal(false)}
          >
            Fechar
          </Button>
        }
        onCancel={() => setShowModal(false)}
        visible={showModal}
      >
        <BBSpining spinning={loading}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Cancelar Solicitação" key="1">
              {idSolicitacao && (
                <FormCancelarSolicitacacao
                  salvarCancelamento={onSalvarCancelamento}
                  idSolicitacao={idSolicitacao}
                />
              )}
            </TabPane>
            <TabPane tab="Dados Solicitação" key="2">
              {solicitacao && <DadosSolicitacao solicitacao={solicitacao} />}
            </TabPane>
          </Tabs>
        </BBSpining>
      </Modal>
    </>
  );
};

const SolicitacoesAndamento = (props) => {
  const [fetching, setFetching] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const authState = useSelector(({ app }) => app.authState);

  const permAdm = verifyPermission({
    ferramenta: "Encantar",
    permissoesRequeridas: ["ADM_ENCANTAR"],
    authState: authState,
  });

  const getSolicitacoesAndamento = useCallback(() => {
    setFetching(true);
    fetchSolicitacoesAndamento({
      statusSolicitacao: props.statusPesquisa,
      somenteMeuPrefixo: props.somenteMeuPrefixo,
    })
      .then((solicitacoesRecebidas) => {
        setSolicitacoes(solicitacoesRecebidas);
      })
      .catch(() => {
        message.error(
          "Não foi possível obter a lista de solicitacoes em andamento."
        );
      })
      .then(() => {
        setFetching(false);
      });
  }, [props.statusPesquisa, props.somenteMeuPrefixo]);

  const commonColumns = [
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
      title: "Pref.Solic.",
      dataIndex: "prefixoSolicitante",
    },
    {
      title: "Dep. Solicitante",
      dataIndex: "nomePrefixoSolicitante",
    },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    { title: "Data Solicitação", dataIndex: "createdAt" },
    {
      title: "Ações",
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <div className={styles.acoes}>
            <Link to={`/encantar/solicitacao/${record.id}`}>
              <EyeOutlined className="link-color" />
            </Link>
            {!(record.finalizado === true) && permAdm && (
              <CancelarSolicitacao
                getSolicitacoesAndamento={getSolicitacoesAndamento}
                idSolicitacao={record.id}
              />
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getSolicitacoesAndamento();
  }, [getSolicitacoesAndamento]);

  return (
    <BBSpining spinning={fetching || props.fetching}>
      <Row style={{ marginBottom: "15px" }}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            icon={<RedoOutlined />}
            style={{ marginLeft: "15px" }}
            onClick={() => getSolicitacoesAndamento()}
            loading={fetching}
          />
        </Col>
      </Row>
      <SearchTable
        columns={commonColumns}
        dataSource={solicitacoes}
        size="small"
        pagination={{ showSizeChanger: true }}
      />
    </BBSpining>
  );
};

export default SolicitacoesAndamento;
