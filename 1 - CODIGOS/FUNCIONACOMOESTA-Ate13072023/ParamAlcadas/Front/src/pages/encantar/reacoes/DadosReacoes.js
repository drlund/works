import React, { useState } from "react";
import { Row, Col } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import { EyeOutlined } from "@ant-design/icons";
import style from "./dadosReacoes.module.scss";
import ReactHtmlParser from "react-html-parser";
import Modal from "antd/lib/modal/Modal";

const DadosReacoes = (props) => {
  const { reacoes } = props;

  const [reacao, setReacao] = useState(null);

  const columns = [
    {
      title: "Funcionário",
      render: (text, record) => {
        return `${record.funciRegistroMatricula} - ${record.funciRegistroNome}`;
      },
    },
    {
      title: "Fonte",
      dataIndex: "fonteReacao",
    },
    {
      title: "Data Registro",
      render: (text, record) => {
        return `${record.createdAt}`;
      },
    },
    {
      title: "Ações",
      align: "center",
      render: (text, record) => {
        return (
          <div
            onClick={() => setReacao(record)}
            className={style.mostrarReacao}
          >
            <EyeOutlined className="link-color" />
          </div>
        );
      },
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <SearchTable
          columns={columns}
          dataSource={reacoes}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </Col>
      <Modal
        title="Dados da Reacão"
        okButtonProps={{ style: { display: "none" } }}
        cancelText={"Fechar"}
        visible={reacao !== null}
        onCancel={() => setReacao(null)}
      >
        <Row>
          <Col span={24}>
            <div>{ reacao && ReactHtmlParser(reacao.conteudoReacao)}</div>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
};

export default DadosReacoes;
