import React, { useState, useEffect } from "react";
import { Col, Row, Card, Typography, List, message } from "antd";
import styles from "./capacitacao.module.scss";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { fetchCapacitacao } from "services/ducks/Encantar.ducks";
import ModalVideo from "./ModalVideo";

const { Title, Paragraph, Text } = Typography;

const Capacitacao = (props) => {
  const { capacitacao, setCapacitacao, setCarregando } = props;
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (video === null) {
      setCarregando(true);
      fetchCapacitacao()
        .then((capacitacao) => {
          setCapacitacao(capacitacao);
        })
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          setCarregando(false);
        });
    }
  }, [video, setCarregando, setCapacitacao]);

  return (
    <>
      <Row gutter={[10, 50]}>
        <Col className={styles.imgWrapper} offset={1} span={9}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/tutorial.jpg`}
            alt="Homem segurando celular ao lado de uma tela com um presente desenhado"
          ></img>
        </Col>
        <Col span={12} offset={1}>
          <Card>
            <Title level={3}> Preparando para encantar nossos clientes </Title>
            <Paragraph className={styles.paragraph}>
              Encantar clientes não é magia, não é obra do acaso e sim, fruto de
              um processo estruturado onde a capacitação possui um papel muito
              importante.
            </Paragraph>
            <Paragraph className={styles.paragraph}>
              Esta página contém 5 vídeos bem curtinhos com conteúdos muito
              práticos e sugestões de como encantar nossos clientes. Incluímos
              também alguns cursos de nossa UNIBB que irão te capacitar em seu
              processo de encantamento
            </Paragraph>
          </Card>
        </Col>
      </Row>
      <Row style={{marginTop: 30}}>
        <Col offset={1} span={11}>
          <List
            size="small"
            header={<Text strong>Videos</Text>}
            bordered
            dataSource={capacitacao?.videos ? capacitacao.videos : []}
            renderItem={(video) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div style={{ textAlign: "left" }}>
                      <p
                        className={styles.linkLike}
                        onClick={() => setVideo(video)}
                      >
                        {video.titulo}
                      </p>
                    </div>
                  }
                />
                {video.finalizado ? (
                  <CheckCircleTwoTone
                    className={styles.icone}
                    witdth={18}
                    twoToneColor="#52c41a"
                  />
                ) : (
                  <CloseCircleTwoTone
                    className={styles.icone}
                    twoToneColor="#FF4D4F"
                  />
                )}
              </List.Item>
            )}
          />
        </Col>
        <Col offset={1} span={11}>
          <List
            size="small"
            header={<Text strong>Cursos</Text>}
            bordered
            dataSource={capacitacao?.cursos ? capacitacao.cursos : []}
            renderItem={(curso) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ textAlign: "left" }}>
                        <a
                          href={curso.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {curso.titulo}
                        </a>
                      </div>
                    }
                  />
                  {curso.finalizado ? (
                    <CheckCircleTwoTone
                      className={styles.icone}
                      witdth={18}
                      twoToneColor="#52c41a"
                    />
                  ) : (
                    <CloseCircleTwoTone
                      className={styles.icone}
                      twoToneColor="#FF4D4F"
                    />
                  )}
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
      <ModalVideo video={video} setVideo={setVideo} />
    </>
  );
};

export default Capacitacao;
