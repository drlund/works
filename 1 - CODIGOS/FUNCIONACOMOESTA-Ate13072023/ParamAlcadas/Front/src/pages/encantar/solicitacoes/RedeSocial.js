import React from "react";
import {
  Col,
  Row,
  Card,
  Typography,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  message,
} from "antd";

import DadosCliente from "./DadosCliente";
import RedeSocialTabela from "./RedeSocialTabela";
import styles from "./redeSocial.module.scss";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const redesSociais = ["Facebook", "Instagram", "Twitter", "Linkedin"];

const { Paragraph, Title } = Typography;
const RedeSocial = (props) => {
  const [form] = Form.useForm();

  return (
    <Row>
      <Col span={24} className={styles.descricaoWrapper}>
        <div className={styles.imgWrapper}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/rede_social.jpg`}
            alt="Mulher usando rede social"
          />
        </div>
        <Card className={styles.txtExplicacao}>
          <Title level={3}> Mídias sociais.</Title>
          <Paragraph className={styles.paragraph}>
            Caso tenha conhecimento, inclua as redes sociais nas quais o cliente
            tem conta. Essa informação não é obrigatória.
          </Paragraph>
        </Card>
      </Col>
      <Col span={7} offset={1}>
        <Card>
          <DadosCliente dadosCliente={props.dadosCliente} />
        </Card>
      </Col>
      <Col span={15} offset={1} className={styles.formWrapper}>
        <Card>
          <Row gutter={[0, 40]}>
            <Col span={24}>
              <Form layout="inline" form={form}>
                <Form.Item name="usuario" label="Usuário">
                  <Input />
                </Form.Item>
                <Form.Item name="qtdSeguidores" label="Qtd. Seguidores">
                  <InputNumber min={0} step={1} />
                </Form.Item>
                <Form.Item name="tipo" label="Rede Social">
                  <Select style={{ width: 120 }}>
                    {redesSociais.map((rede) => {
                      return (
                        <Option
                          value={rede}
                          key={rede}
                          disabled={props.redesSociais
                            .map((rede) => rede.redeSocial)
                            .includes(rede)}
                        >
                          {rede}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => {
                      const dadosRedeSocial = form.getFieldsValue();
                      if (
                        !dadosRedeSocial.usuario ||
                        !dadosRedeSocial.tipo
                      ) {
                        message.error(
                          "Preencha todos os campos da rede social"
                        );
                        return;
                      }
                      props.updateRedesSociais([
                        ...props.redesSociais,
                        form.getFieldsValue(),
                      ]);
                      form.resetFields();
                    }}
                    icon={<PlusOutlined />}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={24}>
              <RedeSocialTabela redesSociais={props.redesSociais} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default RedeSocial;
