import React, { useState, useCallback, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Select,
  Button,
  Spin,
  message, Modal
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AbasListaBrindes from "./AbasListaBrindes";
import BBSpinning from "components/BBSpinning/BBSpinning";
import styles from "./selecionarBrindes.module.scss";

import {
  fetchBrindesPorGestores,
  fetchGestoresBrinde,
} from "services/ducks/Encantar.ducks";

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const SelecionarBrindes = (props) => {
  const [gestores, setGestores] = useState(null);
  const [brindes, setBrindes] = useState(null);
  const [gestoresSelecionados, setGestoresSelecionados] = useState(null);
  const [fetching, setFetching] = useState(false);

  const cbFetchGestoresBrinde = useCallback(async (prefixoFato) => {
    try {
      const gestores = await fetchGestoresBrinde(prefixoFato);
      setGestores(gestores);
    } catch (error) {
      message.error(error);
    }
  }, []);

  const cbFetchBrindesPorGestores = useCallback(
    async (gestoresSelecionados, classificacaoCliente) => {
      const brindes = await fetchBrindesPorGestores(
        gestoresSelecionados,
        classificacaoCliente
      );
      setBrindes(brindes);
    },
    [setBrindes]
  );

  useEffect(() => {
    setFetching(true);
    cbFetchGestoresBrinde(props.prefixoFato);
  }, [props.prefixoFato, cbFetchGestoresBrinde]);

  useEffect(() => {
    setFetching(false);
  }, [gestores, brindes]);

  const updateGestores = (arrayGestores) => {
    setGestoresSelecionados(arrayGestores);
  };

  return (
    <BBSpinning spinning={fetching}>
      <Row gutter={[10, 50]} align="middle" justify="center">
        <Col span={24} offset={1}>
          <Row>
            <Col className={styles.imgWrapper} span={8}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/select_options.jpg`}
                alt="Mulher olhando para um quadro com várias opções"
              />
            </Col>
            <Col span={14}>
              <Card style={{ marginTop: 20 }}>
                <Title level={3}> Vamos escolher os brindes?</Title>
                <Paragraph className={styles.paragraph}>
                  Ativos são formas de materializar o{" "}
                  <Text strong>encantamento</Text> e devem estar relacionados à{" "}
                  <Text strong>história</Text> e ao que é{" "}
                  <Text strong>valioso</Text> para cliente e não ao problema.
                </Paragraph>
                <Paragraph className={styles.paragraph}>
                  Os ativos com data de vencimento, quando estiverem
                  relacionados para um determinado cliente, deve ter preferência
                  aos demais, desde que este ativo tenha relação com o que é
                  valioso para o cliente.
                </Paragraph>
                <Paragraph className={styles.paragraph}>
                  Caso não queira escolher nenhum ativo e enviar somente uma
                  carta, basta clicar "Não marcar item algum" e no botão
                  próximo.
                </Paragraph>
                <Paragraph className={styles.paragraph}>
                  Antes de selecionar um ativo, você precisa selecionar o
                  "gestor de ativos desejado". Este gestor, indica onde está
                  fisicamente aquele ativo e será este o responsável por
                  enviá-lo ao cliente. Cada gestor pode possuir um estoque de
                  ativos diferentes. Lembre-se de tentar selecionar o gestor
                  mais próximo do cliente, para que a entrega ocorra o mais
                  rápido possível e com menor custo.
                </Paragraph>

                <Paragraph className={styles.paragraph}>
                  Selecione abaixo a unidade distribuidora de brindes e clique
                  na <Text strong>LUPA</Text> visualizar e selecionar.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24} offset={1} flex={1}>
          <Row align="center" justify="center">
            <Col span={24} style={{ marginBottom: 30 }}>
              <Spin spinning={!gestores}>
                <Select
                  allowClear
                  mode="multiple"
                  showSearch
                  loading={gestores === null}
                  placeholder={"Selecione o gestor de brinde desejado"}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "40%" }}
                  onChange={updateGestores}
                >
                  {gestores &&
                    gestores.map((gestor) => {
                      return (
                        <Option
                          key={gestor.prefixo}
                          value={gestor.prefixo}
                        >{`${gestor.prefixo} - ${gestor.nomePrefixo}`}</Option>
                      );
                    })}
                </Select>
                <Button
                  disabled={
                    gestoresSelecionados === null ||
                    gestoresSelecionados.length === 0
                  }
                  type="primary"
                  onClick={() => {
                    setFetching(true);
                    cbFetchBrindesPorGestores(
                      gestoresSelecionados,
                      props.classificacaoCliente
                    );
                  }}
                  shape="circle"
                  className={styles.searchButton}
                  icon={<SearchOutlined />}
                />
              </Spin>
            </Col>

            <Col span={24}>
              <AbasListaBrindes brindes={brindes} {...props} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Confirmar solicitação sem brinde"
        visible={props.msgNenhumBrindeLida === true}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={props.setMsgNenhumBrindeLida}
          >
            Ok
          </Button>,
        ]}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        Lembre-se, uma experiência composta do ativo e da mensagem. Deseja continuar sem selecionar nenhum ativo?
      </Modal>
    </BBSpinning>
  );
};

export default SelecionarBrindes;
