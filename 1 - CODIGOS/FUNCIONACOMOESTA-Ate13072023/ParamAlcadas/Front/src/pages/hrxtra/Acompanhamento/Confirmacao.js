import React from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function Confirmacao({protocolo, sucesso}) {

  return sucesso ?
    <Result
      status="success"
      title={
        <>
          <Text>Solicitação </Text>
          <Text>{protocolo}</Text>
          <Text> despachada com sucesso!</Text>
        </>
      }
      extra={[
        <Button key="acompanhar">
          <Link to="/hrxtra/acompanhamento">Acompanhe suas demandas</Link>
        </Button>
      ]}
    />
  :
    <Result
      status="error"
      title={
        <>
          <Text>Problema ao despachar a solicitação </Text>
          <Text>{protocolo}!</Text>
        </>
      }
      extra={[
        <Button key="acompanhar">
          <Link to="/hrxtra/acompanhamento">Acompanhe suas demandas</Link>
        </Button>
      ]}
    />;

}