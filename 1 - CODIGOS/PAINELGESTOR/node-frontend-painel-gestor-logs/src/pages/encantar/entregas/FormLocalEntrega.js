import React, { useState } from "react";
import { Form, Select, Col, Row } from "antd";
import InputPrefixo from "../../../components/inputsBB/InputPrefixo";
import FormEnderecoCliente from "../solicitacoes/FormEnderecoCliente";
import styles from "../solicitacoes/entrega.module.scss";
import constants from "utils/Constants";

const { ENCANTAR } = constants;
const { ENTREGA_AGENCIA, ENTREGA_ENDERECO_CLIENTE } = ENCANTAR;

const { Option } = Select;


const tiposEntrega = [ENTREGA_AGENCIA, ENTREGA_ENDERECO_CLIENTE];

const FormLocalEntrega = (props) => {
  const { dadosEntrega, setDadosEntrega } = props;

  useState(() => {
    if (props.dadosEntrega) {
      setDadosEntrega({ ...props.dadosEntrega });
    }
  }, [props.dadosEntrega]);

  return (
    <Form>
      <Row>
        <Col span={24}>
          <Select
            value={dadosEntrega ? dadosEntrega.localEntrega : null}
            placeholder="Local de Entrega"
            style={{ width: 400, display: "block", marginBottom: 15 }}
            onChange={(value) => {
              if (value === ENTREGA_ENDERECO_CLIENTE) {
                setDadosEntrega({
                  complementoEntrega: dadosEntrega.complementoEntrega,
                  localEntrega: value,
                });
              } else {
                setDadosEntrega({ ...dadosEntrega, localEntrega: value });
              }
            }}
          >
            {tiposEntrega.map((tipo) => {
              return <Option value={tipo}>{tipo}</Option>;
            })}
          </Select>
        </Col>
        {dadosEntrega && dadosEntrega.localEntrega === ENTREGA_AGENCIA && (
          <>
            <Col span={12}>
              <InputPrefixo
                style={{ width: "100%", display: "block", marginBottom: 15 }}
                placeholder="Prefixo para entrega do brinde/carta"
                fullValue
                className={styles.bbinput}
                onChange={(prefixos) =>
                  setDadosEntrega({
                    ...dadosEntrega,
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
              {dadosEntrega && dadosEntrega.prefixoEntrega !== undefined && (
                <p>{`${dadosEntrega.prefixoEntrega.prefixo} - ${dadosEntrega.prefixoEntrega.nome}`}</p>
              )}
            </Col>
          </>
        )}
        <Col span={24}>
          <FormEnderecoCliente
            enderecoCliente={dadosEntrega}
            setEnderecoEntrega={(newEnderecoCliente) =>
              setDadosEntrega({
                ...newEnderecoCliente,
              })
            }
          />
          {/* <TextArea
            placeholder="Informações complementares"
            allowClear
            rows={10}
            value={dadosEntrega.complementoEntrega}
            style={{ width: "90%", display: "block", textAlign: "center" }}
            onChange={(e) =>
              setDadosEntrega({
                ...dadosEntrega,
                complementoEntrega: e.target.value,
              })
            }
          /> */}
        </Col>
      </Row>
    </Form>
  );
};

export default FormLocalEntrega;
