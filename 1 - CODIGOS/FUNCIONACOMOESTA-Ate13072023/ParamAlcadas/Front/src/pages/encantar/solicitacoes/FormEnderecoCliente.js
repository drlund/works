import React, { useState } from "react";
import { Form, Input, Row, Col, Button, message, Spin } from "antd";
import style from "./formEnderecoCliente.module.scss";

import cep from "cep-promise";

const FormEnderecoCliente = (props) => {
  const { enderecoCliente, setEnderecoEntrega } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Spin spinning={loading}>
      <Form>
        <Row>
          <Col span={8}>
            <Form.Item
              required
              label={"CEP"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                value={enderecoCliente.cep}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    cep: e.target.value,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <div className={style.wrapperButton}>
              <Form.Item wrapperCol={{ span: 8 }}>
                <Button
                  onClick={() => {
                    setLoading(true);
                    cep(enderecoCliente.cep)
                      .then((result) => {
                        setEnderecoEntrega({
                          ...enderecoCliente,
                          endereco: result.street,
                          bairro: result.neighborhood,
                          cidade: `${result.city} - ${result.state}`,
                        });
                      })
                      .catch((error) =>
                        message.error("Erro na consulta do CEP")
                      )
                      .then(() => {
                        setLoading(false);
                      });
                  }}
                  type="primary"
                >
                  Preencher com CEP
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              required
              label={"Endereço"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                value={enderecoCliente.endereco}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    endereco: e.target.value,
                  });
                }}
                autoSize={{ minRows: 12 }}
              />
            </Form.Item>
          </Col>
          <Col span={6} offset={1}>
            <Form.Item
              required
              label={"Número"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                value={enderecoCliente.numero}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    numero: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              required
              label={"Bairro"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                value={enderecoCliente.bairro}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    bairro: e.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              required
              label={"Cidade"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                value={enderecoCliente.cidade}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    cidade: e.target.value,
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8} offset={1}>
            <Form.Item
              label={"Complemento"}
              labelAlign="left"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                value={enderecoCliente.complemento}
                onChange={(e) => {
                  setEnderecoEntrega({
                    ...enderecoCliente,
                    complemento: e.target.value,
                  });
                }}
                autoSize={{ minRows: 12 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default FormEnderecoCliente;
