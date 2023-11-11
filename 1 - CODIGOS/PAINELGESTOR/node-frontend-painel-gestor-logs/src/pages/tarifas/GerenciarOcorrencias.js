import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Tooltip,
  Typography,
  message,
  Tabs,
} from "antd";

import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import styles from "./publicoAlvo.module.scss";
import { Link } from "react-router-dom";
import DateBrSort from "utils/DateBrSort";
import {
  getReservasPendentesConta,
  getReservasPendentesEspecie,
  fetchPendentesConfirmacaoPgto,
  getFinalizadas,
} from "services/ducks/Tarifas.ducks";
import {
  EyeOutlined,
  RedoOutlined,
  CheckOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { verifyPermission } from "utils/Commons";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;
const { Paragraph, Title, Text } = Typography;

const columnsPendentesConfirmacaoPgto = [
  {
    dataIndex: "idOcorrencia",
    title: "Id",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: ["dadosCliente", "mci"],
    title: "MCI",
    sorter: (a, b) => AlfaSort(a.mci, b.mci),
  },
  {
    dataIndex: ["dadosCliente", "nome"],
    title: "Nome do Cliente",
    sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
  },
  {
    dataIndex: ["dadosCliente", "cpfCnpj"],
    title: "CPF/CNPJ",
    sorter: (a, b) => AlfaSort(a.nomeCliente, b.nomeCliente),
  },
  {
    dataIndex: "nomeFunciPagamento",
    title: "Funcionário responsável",
    render: (record, text) => {
      return `${text.matriculaFunciPagamento} - ${text.nomeFunciPagamento}`;
    },
  },
  {
    dataIndex: "valor",
    title: "Valor",
  },
  {
    dataIndex: "dataRegistroPgto",
    title: "Registro Pgto.",
    sorter: (a, b) => DateBrSort(a.vlrAtual, b.vlrAtual),
  },
  {
    title: "Ações",
    render: (record, text) => {
      return (
        <div className={styles.acoes}>
          <Tooltip title="Confirmar pagamento">
            <Link to={`/tarifas/confirmar-pgto/${record.idOcorrencia}`}>
              <CheckOutlined className="link-color" />
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

const columnsPendRegistroPgto = [
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
          <Tooltip title="Cancelar Reserva">
            <Link to={`/tarifas/cancelar-reserva/${record.id}`}>
              <CloseCircleOutlined className="link-color" />
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

const columnsFinalizadas = [
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
    dataIndex: "finalizadoEm",
    title: "Finalizado Em",
    sorter: (a, b) => DateBrSort(a.vlrAtual, b.vlrAtual),
  },
  {
    title: "Ações",
    render: (record, text) => {
      return (
        <div className={styles.acoes}>
          <Tooltip title="Verificar Pagamento">
            <Link to={`/tarifas/ocorrencia-finalizada/${record.id}`}>
              <EyeOutlined className="link-color" />
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

const fetchFuncs = {
  pendentesConfirmacaoPgto: fetchPendentesConfirmacaoPgto,
  pendentesEspecie: getReservasPendentesEspecie,
  pendentesConta: getReservasPendentesConta,
  finalizadas: getFinalizadas,
};

const GerenciarOcorrencias = (props) => {
  const [reservas, setReservas] = useState({
    pendentesConfirmacaoPgto: null,
    pendentesEspecie: null,
    pendentesConta: null,
    finalizadas: null,
  });

  const authState = useSelector((state) => {
    return state.app.authState;
  });

  const permPgtoConta = verifyPermission({
    ferramenta: "Tarifas",
    permissoesRequeridas: ["PGTO_CONTA", "ADMIN"],
    authState,
  });

  const [loading, setLoading] = useState(false);

  const onChangeTabs = (key, reload = false) => {
    if (reservas[key] === null || reload) {
      setLoading(true);
      fetchFuncs[key]()
        .then((data) => setReservas({ ...reservas, [key]: data }))
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          setLoading(false);
        });
      setReservas({ ...reservas, [key]: [] });
    }
  };

  useEffect(() => {
    onChangeTabs("pendentesConfirmacaoPgto", false);
    // eslint-disable-next-line
  }, []);

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Card>
            <Row gutter={[0, 20]}>
              <Col span={24}>
                <Title level={5}>Instruções</Title>
                <Paragraph>
                  Conforme Comunicados a Administradores 2021/09227083 (Divar) e
                  2021/09229822 (Dirav) - CTR ESTORNO DE VALORES, de 29/07/2021,
                  funcionários detentores de função gerencial têm acesso para
                  gerenciar as ocorrências de sua agência, conforme a descrição
                  abaixo:
                </Paragraph>
                <Paragraph>
                  <Text strong>Pgto. Registrado</Text>: Ocorrências cujo
                  pagamento já foi registrado e, para serem finalizadas,
                  precisam da confirmação por parte de um funcionário detentor
                  de função gerencial. Neste caso, é possível cancelar o
                  registro do pagamento para que o mesmo seja registrado
                  novamente. Se você deseja CONFIRMAR UM PAGAMENTO EFETUADO,
                  clique na opção “confirmar pagamento” (abaixo das Ações) e
                  siga para a próxima tela.
                </Paragraph>
                <Paragraph>
                  <Text strong>Reservadas - pgto. especie</Text>: Ocorrências
                  que foram reservadas para pagamento em espécie e o pagamento
                  ainda não foi registrado. Neste caso é possível cancelar a
                  reserva, para que seja possível realizá-la novamente.
                </Paragraph>
                {permPgtoConta && (
                  <Paragraph>
                    <Text strong>Reservadas - pgto. conta</Text>: Ocorrências
                    que foram reservadas para pagamento em conta e o pagamento
                    ainda não foi registrado. Neste caso,{" "}
                    <Text strong>apenas o Cenop</Text> pode cancelar a reserva,
                    para que seja possível realizá-la novamente.
                  </Paragraph>
                )}
                <Paragraph>
                  <Text strong>Finalizadas</Text>: Ocorrências onde o pagamento
                  já foi registrado, comprovante anexado e confirmado por função
                  gerencial. Neste caso a ocorrência está finalizada e não é
                  possível reverter a situação.
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Tabs
            type="card"
            onChange={(key) => {
              onChangeTabs(key);
            }}
          >
            <TabPane tab="Pgto. Registrado" key="pendentesConfirmacaoPgto">
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    icon={<RedoOutlined />}
                    style={{ marginLeft: "15px" }}
                    onClick={() =>
                      onChangeTabs("pendentesConfirmacaoPgto", true)
                    }
                    loading={loading}
                  />
                </Col>
                <Col span={24}>
                  <SearchTable
                    columns={columnsPendentesConfirmacaoPgto}
                    dataSource={
                      Array.isArray(reservas.pendentesConfirmacaoPgto)
                        ? reservas.pendentesConfirmacaoPgto
                        : []
                    }
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Reservadas - pgto. especie " key="pendentesEspecie">
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    icon={<RedoOutlined />}
                    style={{ marginLeft: "15px" }}
                    onClick={() => onChangeTabs("pendentesEspecie", true)}
                    loading={loading}
                  />
                </Col>
                <Col span={24}>
                  <SearchTable
                    columns={columnsPendRegistroPgto}
                    dataSource={
                      Array.isArray(reservas.pendentesEspecie)
                        ? reservas.pendentesEspecie
                        : []
                    }
                  />
                </Col>
              </Row>
            </TabPane>
            {permPgtoConta && (
              <TabPane tab="Reservadas - pgto. conta " key="pendentesConta">
                <Row>
                  <Col span={24} style={{ textAlign: "right" }}>
                    <Button
                      icon={<RedoOutlined />}
                      style={{ marginLeft: "15px" }}
                      onClick={() => onChangeTabs("pendentesConta", true)}
                      loading={loading}
                    />
                  </Col>
                  <Col span={24}>
                    <SearchTable
                      columns={columnsPendRegistroPgto}
                      dataSource={
                        Array.isArray(reservas.pendentesConta)
                          ? reservas.pendentesConta
                          : []
                      }
                    />
                  </Col>
                </Row>
              </TabPane>
            )}
            <TabPane tab="Finalizadas" key="finalizadas">
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    icon={<RedoOutlined />}
                    style={{ marginLeft: "15px" }}
                    onClick={() => onChangeTabs("finalizadas", true)}
                    loading={loading}
                  />
                </Col>
                <Col span={24}>
                  <SearchTable
                    columns={columnsFinalizadas}
                    dataSource={
                      Array.isArray(reservas.finalizadas)
                        ? reservas.finalizadas
                        : []
                    }
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default GerenciarOcorrencias;
