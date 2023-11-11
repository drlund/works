import React, { useState, useEffect, useCallback } from "react";
import DateBrSort from "utils/DateBrSort";

import AlfaSort from "utils/AlfaSort";
import { FormOutlined } from "@ant-design/icons";
import { Row, Col, Spin, Checkbox, Button, DatePicker, Form } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import { Link } from "react-router-dom";
import "moment/locale/pt-br";
import { getNotificacoesFilaEnvio } from "services/ducks/Mtn.ducks";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/pt_BR";

const columns = [
  {
    dataIndex: "nrMtn",
    title: "Nr. Mtn",
    searchText: false,
    sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
  },

  {
    dataIndex: "criadoEm",
    title: "Data do envio",
    searchText: false,
    sorter: (a, b) => DateBrSort(a.criadoEm, b.criadoEm),
  },

  {
    title: "Envolvido",
    sorter: (a, b) => AlfaSort(a.envolvido.matricula, b.envolvido.matricula),
    render: (text, record) => {
      return (
        <p>{`${record.envolvido.matricula} - ${record.envolvido.nome}`}</p>
      );
    },
  },
  {
    title: "Email",
    sorter: (a, b) => AlfaSort(a.email, b.email),
    render: (text, record) => {
      return record.email;
    },
  },
  {
    title: "Tipo",
    sorter: (a, b) => AlfaSort(a.tipo, b.tipo),
    render: (text, record) => {
      return record.tipo;
    },
  },
  {
    title: "Enviado com sucesso",
    sorter: (a, b) => AlfaSort(a.sucesso, b.sucesso),
    render: (text, record) => {
      return record.sucesso ? "Sim" : "Não";
    },
  },
  {
    title: "Analisar",
    align: "center",
    render: (text, record) => {
      return (
        <Link to={`analisar/${record.idMtn}`}>
          {" "}
          <FormOutlined className="link-color" />{" "}
        </Link>
      );
    },
  },
];

const NotificacoesFilaEnvio = (props) => {
  const [notificacoes, setNotificacoes] = useState(null);
  const [dataCriacaoNotificacao, setDataCriacaoNotificacao] = useState(
    moment()
  );
  const [fetching, setFetching] = useState(false);
  const [incluirComSucesso, setIncluirComSucesso] = useState(false);

  const fetchNotificacoesFilaEnvio = useCallback(() => {
    setFetching(true);
    getNotificacoesFilaEnvio({
      dataCriacaoNotificacao: dataCriacaoNotificacao.format("YYYY-MM-DD"),
      incluirComSucesso,
    }).then((notificacoesRecebidas) => {
      setNotificacoes(notificacoesRecebidas);
      setFetching(false);
    });
  }, [dataCriacaoNotificacao, incluirComSucesso]);

  useEffect(() => {
    if (notificacoes === null) {
      fetchNotificacoesFilaEnvio();
    }
  }, [fetchNotificacoesFilaEnvio, notificacoes]);

  return (
    <Row>
      <Col span={24}>
        <Spin spinning={fetching}>
          <Row gutter={[0, 30]}>
            <Col span={24}>
              <Form labelCol={{ span: 18 }} layout="inline">
                <Form.Item label={"Data da Notificação"}>
                  <DatePicker
                    value={dataCriacaoNotificacao}
                    locale={locale}
                    format="DD/MM/YYYY"
                    onChange={(novaData) => setDataCriacaoNotificacao(novaData)}
                    showToday={false}
                  />
                </Form.Item>
                <Form.Item>
                  <Checkbox
                    checked={incluirComSucesso}
                    onChange={() => setIncluirComSucesso(!incluirComSucesso)}
                  >
                    Somente enviados com sucesso?
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => fetchNotificacoesFilaEnvio()}
                  >
                    Pesquisar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={24}>
              <SearchTable
                columns={columns}
                dataSource={notificacoes ? notificacoes : []}
                size="small"
                pagination={{ showSizeChanger: true }}
              />
            </Col>
          </Row>
        </Spin>
      </Col>
    </Row>
  );
};

export default NotificacoesFilaEnvio;
