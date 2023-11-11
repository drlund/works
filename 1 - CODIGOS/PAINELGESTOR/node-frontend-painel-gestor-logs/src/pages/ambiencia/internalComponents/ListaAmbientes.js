import React from 'react';
import { Col, Row, Card, Rate, Typography } from 'antd';
import styles from '../Ambiencia.module.css';

const { Text } = Typography;

const ListaAmbientes = (props) => {
  const { ambientes, indiceAmbienteAtual, onChangeAmbiente } = props;

  return (
    <>
      {ambientes.map((ambiente, index) => {
        return (
          <Col span={6} key={index}>
            <div className={styles.avaliacaoWrapper}>
              <div
                className={
                  index === indiceAmbienteAtual
                    ? styles.overlaySelecionado
                    : styles.overlayNaoSelecionado
                }
              ></div>
              <Card
                onClick={() => onChangeAmbiente(index)}
                title={
                  <Text ellipsis={{ tooltip: true }}>
                    {ambiente.ambienteDescricao}
                  </Text>
                }
                className={styles.cardAvaliacao}
              >
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <Text strong>Avaliação: </Text>
                    {ambiente.avaliacao === null ? (
                      'Pendente'
                    ) : (
                      <Rate disabled value={ambiente.avaliacao} />
                    )}
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default ListaAmbientes;
