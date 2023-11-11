import React, { useEffect, useCallback } from "react";
import styles from "./entrega.module.scss";
import { Col, Row, Select, Card, Typography } from "antd";
import InputPrefixo from "../../../components/inputsBB/InputPrefixo";
import FormEnderecoCliente from "./FormEnderecoCliente";
import _ from "lodash";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const tiposEntrega = ["Agência", "Endereço do Cliente"];

const Entrega = (props) => {
  const {
    dadosEntrega,
    enderecoCliente,
    setDadosEntrega,
    setEnderecoCliente,
  } = props;

  const updateDadosEntrega = useCallback(
    (dadosAtualizados) => {
      setDadosEntrega(dadosAtualizados);
    },
    [setDadosEntrega]
  );

  const updateEnderecoCliente = useCallback(
    (dadosAtualizados) => {
      setEnderecoCliente(dadosAtualizados);
    },
    [setEnderecoCliente]
  );

  useEffect(() => {
    if (
      dadosEntrega.localEntrega &&
      dadosEntrega.localEntrega !== "Agência" &&
      dadosEntrega.prefixoEntrega
    ) {
      const newDadosEntrega = _.cloneDeep(dadosEntrega);
      delete newDadosEntrega.prefixoEntrega;

      updateDadosEntrega({
        ...newDadosEntrega,
      });
    }
  }, [dadosEntrega, updateDadosEntrega]);

  return (
    <Row>
      {/* Informativo */}
      <Col span={11} offset={1} className={styles.imgWrapper}>
        <Card style={{ marginTop: 20 }}>
          <Title level={3}> Informe o local de entrega</Title>
          <Paragraph>
            Informe aonde os brindes deverão ser entregues e qual o método de
            envio. Informe também qual o identificador da entrega (Código dos
            correios, nr. do lacre do malote e etc.)
          </Paragraph>
        </Card>
      </Col>
      {/* Local de Entrega */}
      <Col span={11} offset={1}>
        <div className={styles.wrapperLocalEntrega}>
          <Row>
            <Col span={24}>
              <Select
                value={
                  props.dadosEntrega ? props.dadosEntrega.localEntrega : null
                }
                placeholder="Local de Entrega"
                style={{ width: 400, display: "block", marginBottom: 15 }}
                onChange={(value) =>
                  updateDadosEntrega({
                    ...props.dadosEntrega,
                    localEntrega: value,
                  })
                }
              >
                {tiposEntrega.map((tipo) => {
                  return <Option value={tipo}>{tipo}</Option>;
                })}
              </Select>
            </Col>
            {props.dadosEntrega &&
              props.dadosEntrega.localEntrega === "Agência" && (
                <>
                  <Col span={12}>
                    <InputPrefixo
                      style={{
                        width: "100%",
                        display: "block",
                        marginBottom: 15,
                      }}
                      placeholder="Prefixo para entrega do brinde/carta"
                      fullValue
                      className={styles.bbinput}
                      onChange={(prefixos) =>
                        updateDadosEntrega({
                          ...props.dadosEntrega,
                          prefixoEntrega: prefixos[0],
                        })
                      }
                    />
                  </Col>
                  <Col
                    span={11}
                    offset={1}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    {props.dadosEntrega &&
                      props.dadosEntrega.prefixoEntrega !== undefined && (
                        <p>{`${props.dadosEntrega.prefixoEntrega.prefixo} - ${props.dadosEntrega.prefixoEntrega.nome}`}</p>
                      )}
                  </Col>
                </>
              )}
          </Row>
        </div>
      </Col>

      {/* Endereço do cliente */}
      <Col span={24} style={{ marginTop: 30 }}>
        <Row>
          <Col span={14} offset={6}>
            <Card>
              <FormEnderecoCliente
                enderecoCliente={enderecoCliente}
                setEnderecoEntrega={(newEnderecoCliente) =>
                  updateEnderecoCliente({
                    ...newEnderecoCliente,
                  })
                }
              />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Entrega;
