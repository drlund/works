import React, { useState } from 'react';
import { Result, Button, Typography } from 'antd';
import { Link } from "react-router-dom";
import useEffectOnce from 'utils/useEffectOnce';
import _ from 'lodash';

const { Text } = Typography;

export default function TudoOk(props) {

  const [opcoes, setOpcoes] = useState(null);

  const getOpcoes = (opcao, protocol = null) => {
    const opcoes = {
      0: {
        status: "error",
        titulo: <Text>Houve um problema ao processar sua Solicitação de Movimentação Transitória.<br />Atualize a página e refaça sua operação.</Text>
      },
      1: {
        status: "success",
        titulo: <Text>Protocolo {protocol} gerado com sucesso!</Text>
      }
    }

    return opcoes[opcao];
  }


  useEffectOnce(() => {
    const opcao = props.protocolo ? 1 : 0;

    setOpcoes(prev => getOpcoes(opcao, props.protocolo));
  });


  return (
    !_.isNil(opcoes) &&
    <Result
      status={opcoes.status}
      title={opcoes.titulo}
      extra={[
        <Button type="primary" onClick={() => props.confirmar()} key="novo">
          Nova Solicitação
        </Button>,
        <React.Fragment  key="cadeia">
          {
            (opcoes.status === "success" && props.tipo.id === 1)&&
              <Button onClick={() => props.confirmar(props.protocolo)} key="cadeia">
                Nova Solicitação em Complemento
              </Button>
          }
        </React.Fragment>,
        <Button key="acompanhar">
          <Link to="/designacao/">Acompanhe suas demandas</Link>
        </Button>
      ]}
    />
  )
}