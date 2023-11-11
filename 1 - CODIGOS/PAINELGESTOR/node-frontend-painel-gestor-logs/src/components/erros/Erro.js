import React from "react";
import {Row, Col, Result} from 'antd';

const Erro = ({erro}) => {
  return (
    <Row>
      <Col span={24}>
        <Result status={erro.codigo} title={erro.codigo} subTitle={erro.msg} />
      </Col>
    </Row>
  );
};

export default Erro;
