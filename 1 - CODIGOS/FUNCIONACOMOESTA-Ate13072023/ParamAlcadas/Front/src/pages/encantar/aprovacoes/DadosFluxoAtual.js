import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getProfileURL } from "utils/Commons";
import { Col, Row, Typography, Alert, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
const { Text, Paragraph, Title } = Typography;
const DadosFluxoAtual = (props) => {
  const { fluxoAtual } = props;
  return (
    <Row>
      <Col span={24}>
        <Alert
          message={
            <Text>
              Aprovação pendente no prefixo{" "}
              <Text strong>
                {" "}
                {fluxoAtual.prefixoAutorizador} -{" "}
                {fluxoAtual.nomePrefixoAutorizador}
              </Text>
            </Text>
          }
        />
      </Col>
    </Row>
  );
};

export default DadosFluxoAtual;
