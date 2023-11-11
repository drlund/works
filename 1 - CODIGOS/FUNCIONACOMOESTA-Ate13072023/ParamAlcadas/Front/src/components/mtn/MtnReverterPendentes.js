import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchTable from "../searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import { FormOutlined } from "@ant-design/icons";
import {
  Tooltip,
  Modal,
  Button,
  Spin,
  message,
  Row,
  Col,
  Popconfirm,
} from "antd";
import DadosParecer from "./MtnDadosParecerReverterSolicitacao";
import {
  confirmarAlteracaoMedida,
  cancelarSolicitacao,
} from "services/ducks/Mtn.ducks";

const MtnReverterPendentes = (props) => {
  const reversoesPendentes = useSelector(
    ({ mtn }) => mtn.admOcorrencias.reversao.solicitacoesPendentes
  );

  const matricula = useSelector(({ app }) => app.authState.sessionData.chave);

  const [solicitacaoAtual, setSolicitacaoAtual] = useState(null);
  const [autorizandoReversao, setAutorizandoReversao] = useState(false);

  //Funções

  const confirmarSolicitacao = (idSolicitacao) => {
    setAutorizandoReversao(true);
    confirmarAlteracaoMedida(idSolicitacao)
      .then(() => {
        setSolicitacaoAtual(null);
        message.success("Solicitação de reversão gravada com sucesso.");
      })
      .catch((error) => message.error(error))
      .then(() => {
        setAutorizandoReversao(false);
        props.reloadFunc();
      });
  };

  const cancelarSolicitacaoPendente = (idSolicitacao) => {
    setAutorizandoReversao(true);
    cancelarSolicitacao(idSolicitacao)
      .then(() => {
        setSolicitacaoAtual(null);
        message.success("Solicitação de alteração excluida com sucesso.");
        props.reloadFunc();
      })
      .catch((error) => message.error(error))
      .then(() => {
        setAutorizandoReversao(false);
      });
  };

  //Table Columns
  const columns = [
    {
      dataIndex: "nrMtn",
      title: "Nr. Mtn",
      sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
    },
    {
      dataIndex: "matricula",
      title: "Matrícula",
      sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
    },
    {
      dataIndex: "nomeFunci",
      title: "Nome",
      sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
    },

    {
      title: "Ações",
      align: "center",
      render: (text, record) => (
        <Tooltip title="Solicitar Reversão">
          <FormOutlined
            onClick={() => setSolicitacaoAtual({ ...record })}
            className="link-color link-cursor"
          />
        </Tooltip>
      ),
    },
  ];

  const isUsuarioSolicitante =
    solicitacaoAtual &&
    matricula === solicitacaoAtual.alteracoesMedida[0].matriculaSolicitante;

  return (
    <>
      <SearchTable columns={columns} dataSource={reversoesPendentes} />

      <Modal
        title="Confirmar Reversão da Análise"
        visible={solicitacaoAtual}
        onCancel={() => setSolicitacaoAtual(null)}
        width={800}
        onOk={() => confirmarSolicitacao()}
        closable={!autorizandoReversao}
        maskClosable={!autorizandoReversao}
        footer={[
          <Button
            key="back"
            loading={autorizandoReversao}
            onClick={() => setSolicitacaoAtual(null)}
          >
            Fechar
          </Button>,

          <Popconfirm
            title="Tem certeza que deseja cancelar a solicitacão?"
            onConfirm={() =>
              cancelarSolicitacaoPendente(
                solicitacaoAtual.alteracoesMedida[0].id
              )
            }
            okText="Sim"
            cancelText="Não"
          >
            <Button key="back" loading={autorizandoReversao} type="primary">
              Cancelar Solicitação
            </Button>
          </Popconfirm>,
          <>
            {isUsuarioSolicitante ? null : (
              <Popconfirm
                title="Tem certeza que deseja alterar esta medida?"
                onConfirm={() =>
                  confirmarSolicitacao(solicitacaoAtual.alteracoesMedida[0].id)
                }
                okText="Sim"
                cancelText="Não"
              >
                <Button
                  key="submit"
                  type="danger"
                  loading={autorizandoReversao}
                >
                  Confirmar Reversão
                </Button>
              </Popconfirm>
            )}
          </>,
        ]}
      >
        {solicitacaoAtual && (
          <Spin spinning={autorizandoReversao} style={{ width: "100%" }}>
            <Row gutter={[0, 30]}>
              <Col span={24}>
                <DadosParecer envolvido={solicitacaoAtual} />
              </Col>
            </Row>
          </Spin>
        )}
      </Modal>
    </>
  );
};

export default MtnReverterPendentes;
//
