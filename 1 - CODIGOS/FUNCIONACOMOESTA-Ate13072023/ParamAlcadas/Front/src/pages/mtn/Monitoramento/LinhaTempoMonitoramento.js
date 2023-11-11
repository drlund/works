import React from "react";
import { Col, Row, Timeline } from "antd";
import styles from "./LinhaTempoMonitoramento.module.scss";

const LinhaTempoMonitoramento = (props) => {
  const { linhaTempo } = props;

  return (
    <Row>
      <Col span={24}>
        <div className={styles.wrapperLinhaTempo}>
          <Timeline>
            {linhaTempo.map((evento) => {
              return (
                <Timeline.Item>
                  {`${evento.descricao} Realizado em ${evento.criadoEm}`}
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      </Col>
    </Row>
  );
};

export default LinhaTempoMonitoramento;
