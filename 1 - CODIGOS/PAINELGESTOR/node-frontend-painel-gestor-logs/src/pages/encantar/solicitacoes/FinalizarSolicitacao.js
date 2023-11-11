import React from "react";
import { Card, Row, Col, Typography, } from "antd";
import DadosSolicitacao from "./DadosSolicitacao";
import styles from "./finalizarSolicitacao.module.scss";
const { Title, Paragraph } = Typography;

const FinalizarSolicitacao = (props) => {
  return (
    <Row>
      <Col span={8} offset={1} className={styles.imgWrapper}>
        {/* <img
          src={`${process.env.PUBLIC_URL}/assets/images/complete.svg`}
          alt="Imagem representação a finalização de um processo"
        /> */}
        <Card style={{ marginTop: 20 }}>
          <Title level={3}> Hora de conferir</Title>
          <Paragraph className={styles.paragraph}>
            Agora é a hora de conferir todos os dados da ação e para garantir
            que tudo está certo. Caso positivo, clique no botão finalizar.
          </Paragraph>
        </Card>
      </Col>
      <Col span={13} offset={1}>
        <DadosSolicitacao solicitacao={props.dadosForm} />
      </Col>
    </Row>
  );
};

export default FinalizarSolicitacao;
