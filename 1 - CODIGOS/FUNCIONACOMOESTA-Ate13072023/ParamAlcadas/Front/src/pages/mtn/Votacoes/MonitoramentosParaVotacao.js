import React, { useEffect, useState } from "react";
import { Row, Col, Button, message, Typography } from "antd";
import { ReloadOutlined, FileDoneOutlined } from "@ant-design/icons";
import SearchTable from "components/searchtable/SearchTable";
import BBSpining from "components/BBSpinning/BBSpinning";
import { getVotacoesUsuario } from "services/ducks/MtnComite.ducks";
import history from "history.js";
const { Link } = Typography;

const columns = [
  { title: "Nome", dataIndex: "nome" },
  { title: "Nome Reduzido", dataIndex: "nomeReduzido" },
  {
    title: "Status Parâmetro",
    render: (text, record) => {
      return record.versaoAtual.status;
    },
  },
  { title: "Criado em", dataIndex: "createdAt" },
  {
    title: "Ações",
    align: "center",
    render: (text, record) => {
      return (
        <Link>
          <FileDoneOutlined
            onClick={() =>
              history.push(`/mtn/monitoramento/votar-versao/${record.id}`)
            }
          />
        </Link>
      );
    },
  },
];

const MonitoramentosParaVotacao = (props) => {
  const [monitoramentos, setMonitoramentos] = useState(null);
  const [loading, setLoading] = useState(false);

  const onGetVotacoesUsuario = () => {
    setLoading(true);
    getVotacoesUsuario()
      .then((fetchedMonitoramentos) => {
        setMonitoramentos(fetchedMonitoramentos);
      })
      .catch((error) => {
        message.error(error);
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (monitoramentos !== null) {
      message.success("Monitoramentos em andamento atualizados!");
    }
  }, [monitoramentos]);

  useEffect(() => {
    onGetVotacoesUsuario();
  }, []);

  return (
    <BBSpining spinning={loading}>
      <Row justify="end" gutter={[0, 20]}>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "end", paddingTop: 20 }}
        >
          <Button
            loading={loading}
            onClick={onGetVotacoesUsuario}
            icon={<ReloadOutlined />}
          />
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
    </BBSpining>
  );
};

export default MonitoramentosParaVotacao;
