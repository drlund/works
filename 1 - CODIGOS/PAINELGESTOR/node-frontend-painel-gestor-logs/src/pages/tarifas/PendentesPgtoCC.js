import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Tooltip, Typography, message } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import styles from "./publicoAlvo.module.scss";
import { Link } from "react-router-dom";
import DateBrSort from "utils/DateBrSort";
import { getReservasPendentesConta } from "services/ducks/Tarifas.ducks";
import { FileDoneOutlined, RedoOutlined } from "@ant-design/icons";
import BBSpinning from "components/BBSpinning/BBSpinning";

const { Paragraph, Title } = Typography;

const columns = [
  {
    dataIndex: "id",
    title: "Id",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: "mci",
    title: "MCI",
    sorter: (a, b) => AlfaSort(a.mci, b.mci),
  },
  {
    dataIndex: "nomeCliente",
    title: "Nome do Cliente",
    sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
  },
  {
    dataIndex: "funciReserva",
    title: "Funcionário responsável",
  },
  {
    dataIndex: "valor",
    title: "Valor",
  },
  {
    dataIndex: "dataReserva",
    title: "Data da reserva",
    sorter: (a, b) => DateBrSort(a.vlrAtual, b.vlrAtual),
  },
  {
    title: "Ações",
    render: (record, text) => {
      return (
        <div className={styles.acoes}>
          <Tooltip title="Registrar pagamento">
            <Link to={`/tarifas/registrar-pagamento-conta/${record.id}`}>
              <FileDoneOutlined className="link-color" />
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

const PendentesPgtoCC = (props) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === true) {
      getReservasPendentesConta()
        .then((reservas) => setReservas(reservas))
        .catch((error) => message.error(error))
        .then(() => setLoading(false));
    }
  }, [loading]);

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Card>
            <Row gutter={[0, 20]}>
              <Col span={24}>
                <Title level={5}>Instruções</Title>
                <Paragraph>
                  Após a realização da reserva de pagamento em conta corrente, a
                  operação deve ser registrada nesta ferramenta. Para tanto,
                  selecione a ocorrência e preencha os campos necessários. Siga
                  os procedimentos previstos no comunicado Comunicados a
                  Administradores 2021/09227083 (Divar) e 2021/09229822 (Dirav)
                  - CTR ESTORNO DE VALORES, de 29/07/2021, caso tenha dúvidas em
                  como prosseguir com o pagamento.
                </Paragraph>
                <Paragraph>
                  A listagem abaixo contém as ocorrências que foram registradas
                  para pagamento em conta corrente.
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            icon={<RedoOutlined />}
            style={{ marginLeft: "15px" }}
            onClick={() => setLoading(true)}
            loading={loading}
          />
        </Col>
        <Col span={24}>
          <SearchTable columns={columns} dataSource={reservas} />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default PendentesPgtoCC;
