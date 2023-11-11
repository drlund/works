import React from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function Confirmacao(props) {

  return (
    <Result
      status="success"
      title={
        <>
          <Text>Solicitação </Text>
          <Text>{props.novo}</Text>
          <Text> gerada com sucesso!</Text>
        </>
      }
      extra={[
        <Button key="acompanhar">
          <Link to="/hrxtra/acompanhamento">Acompanhe suas demandas</Link>
        </Button>
      ]}
    />
  )
}