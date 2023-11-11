import React from "react";
import { Col, Row, Input, Card, Typography, Modal, Button } from "antd";
import styles from "./mci.module.scss";

const { Title, Paragraph, Text } = Typography;
const MCI = (props) => {

  return (
    <>
      <Row gutter={[10, 50]}>
        <Col className={styles.imgWrapper} offset={1} span={9}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/send_gift.jpg`}
            alt="Homem segurando celular ao lado de uma tela com um presente desenhado"
          ></img>
        </Col>
        <Col span={12} offset={1}>
          <Card>
            <Title level={3}> Quem você vai encantar hoje ? </Title>
            <Paragraph className={styles.paragraph}>
              Diariamente, ao ser resolutivo, você já{" "}
              <Text strong>encanta</Text> diversos clientes.
            </Paragraph>
            <Paragraph className={styles.paragraph}>
              Agora é hora de fazer algo a mais. É o momento de SUPERAR as
              expectativas de nossos clientes.
            </Paragraph>
            <Paragraph className={styles.paragraph}>
              Sua escolha, deve ser acima de tudo em busca de um atendimento
              humanizado e para <Text strong>encantar</Text> o cliente, você
              precisa de sensibilidade para encontrar nas entrelinhas da
              história que acompanha os fatos, o que é realmente valioso para
              esse cliente.
            </Paragraph>
          </Card>
        </Col>
      </Row>
      <Row className={styles.pesquisaWrapper}>
        <Col offset={8} span={8}>
          <Input
            placeholder="MCI do cliente"
            value={props.value}
            onChange={(e) => props.updateFunc(e.target.value)}
            size="large"
          />
        </Col>
      </Row>
      <Modal
        title="Cliente já incluído em ações anteriores."
        visible={props.msgClienteJaRecebeuSolicitacaoLida === false}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={props.setMsgClienteJaRecebeuSolicitacaoLida}
          >
            Ok
          </Button>,
        ]}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        Ops! Cliente já encantando em ações anteriores. Verifique a real
        viabilidade de encantar esse cliente novamente e caso queira continuar,
        clique no botão "Próximo" novamente.
      </Modal>
    </>
  );
};

export default MCI;
