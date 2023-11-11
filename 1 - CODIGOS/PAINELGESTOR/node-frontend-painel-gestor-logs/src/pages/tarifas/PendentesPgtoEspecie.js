import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Tooltip, Typography, message } from "antd";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import styles from "./publicoAlvo.module.scss";
import { Link } from "react-router-dom";
import DateBrSort from "utils/DateBrSort";
import { getReservasPendentesEspecie } from "services/ducks/Tarifas.ducks";
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
            <Link to={`/tarifas/registrar-pagamento-especie/${record.id}`}>
              <FileDoneOutlined className="link-color" />
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

const PendentesPgtoEspecie = (props) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading === true) {
      getReservasPendentesEspecie()
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
                  Após a realização da reserva e do pagamento em espécie, o
                  comprovante de pagamento deve ser anexado nesta ferramenta
                  seguindo os procedimentos abaixo:
                </Paragraph>
                <Paragraph>
                  <ol>
                    <li>
                      Localize o pagamento para o qual deseja anexar o
                      comprovante;
                    </li>
                    <li>Clique na opção “Ações” {">"} Registrar pagamento;</li>
                    <li>Na tela seguinte, anexe e salve o comprovante;</li>
                    <li>
                      Solicite a um Gerente para confirmar o pagamento no menu à
                      esquerda, opção “Gerenciar” (valores superiores a R$
                      2.000,00 - dois mil - só podem ser liberados por Gerente
                      Geral).
                    </li>
                  </ol>
                </Paragraph>
                <Paragraph>
                  A listagem abaixo contém as ocorrências que foram registradas
                  por funcionário lotado no mesmo prefixo que você ou que
                  pertença a prefixo atendido pelo PSO ao qual você está lotado.
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

export default PendentesPgtoEspecie;
