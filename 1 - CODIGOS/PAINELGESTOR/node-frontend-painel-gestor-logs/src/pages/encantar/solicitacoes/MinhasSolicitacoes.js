import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import useSolicitacoesMeuPrefixo from 'hooks/encantar/useSolicitacoesMeuPrefixo';

const SolicitacoesMeuPrefixo = (props) => {

  const solicitacoesMeuPrefixo = useSolicitacoesMeuPrefixo();

  return (
    <Row>
      <Col span={24}>Conteúdo do componente MinhasSolicitacoes</Col>
    </Row>
  );
};

export default SolicitacoesMeuPrefixo;