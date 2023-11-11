import React, { useState } from "react";
import {
  Alert,
  Descriptions,
  Rate,
  Row,
  Col,
  Button,
  Modal,
  Table,
} from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import styles from "./dadosCliente.module.scss";

const columns = [
  {
    title: "MCI",
    dataIndex: "mci",
    key: "mci",
  },
  {
    title: "Nome",
    dataIndex: "nomeCliente",
    key: "nomeCliente",
  },
  {
    title: "Data Criação",
    dataIndex: "dataSolicitacao",
    key: "dataSolicitacao",
  },
  {
    title: "Visualizar",
    align: "center",
    render: (text, record) => {
      return (
        <span>
          <Link target="_blank" to={`/encantar/solicitacao/${record.id}`}>
            <EyeOutlined className="link-color" />
          </Link>
        </span>
      );
    },
  },
];

const TabelaSolicitacoesAnteriores = ({ solicitacoes }) => {
  return <Table size="small" dataSource={solicitacoes} columns={columns} />;
};

const DadosCliente = (props) => {
  const possuiSolicitacoesAnteriores =
    props.dadosCliente.solicitacoesAnteriores &&
    props.dadosCliente.solicitacoesAnteriores.length > 0;
  const showAlertaSolicitacoesAnteriores =
    typeof props.showAlert !== "undefined" ? props.showAlert : true;

  const [showSolicitacoesAnteriores, setShowSolicitacoesAnteriores] = useState(
    false
  );
  return (
    <Row gutter={[0, 20]}>
      {possuiSolicitacoesAnteriores && showAlertaSolicitacoesAnteriores && (
        <Col span={24}>
          <Alert
            message="Cliente já incluído em ações anteriores"
            type="warning"
          />
        </Col>
      )}
      <Col span={24}>
        <Descriptions layout="vertical" column={4} size={"small"} bordered>
          <Descriptions.Item
            span={4}
            label={
              <div className={styles.labelCliente}>
                <div>Cliente</div>
                {possuiSolicitacoesAnteriores && (
                  <Button onClick={() => setShowSolicitacoesAnteriores(true)}>
                    Solicitações Anteriores
                  </Button>
                )}
              </div>
            }
          >
            {`${props.dadosCliente.MCI} - ${props.dadosCliente.nomeCliente}`}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Prefixo">
            {`${props.dadosCliente.prefixoEncarteirado} - ${props.dadosCliente.nomePrefixo}`}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Carteira">
            {`${props.dadosCliente.nrCarteira} - ${props.dadosCliente.nomeCarteira}`}
          </Descriptions.Item>
          <Descriptions.Item span={4} label="Gerente">
            {`${props.dadosCliente.matriculaGerente} - ${props.dadosCliente.nomeGerente}`}
          </Descriptions.Item>
          <Descriptions.Item span={4} label="Classificação do Cliente">
            <Rate value={props.dadosCliente.classificacao} disabled />
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Modal
        title="Ações Anteriores"
        visible={showSolicitacoesAnteriores === true}
        width={900}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => setShowSolicitacoesAnteriores(false)}
          >
            Fechar
          </Button>,
        ]}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        <TabelaSolicitacoesAnteriores
          solicitacoes={props.dadosCliente.solicitacoesAnteriores}
        />
      </Modal>
    </Row>
  );
};

export default DadosCliente;
