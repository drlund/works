import React from 'react';
import { Descriptions, Form, Input, message } from 'antd';
import constantes from 'pages/flexCriterios/helpers/constantes';
import estilos from '../../flexCriterios.module.css';

export default function PrefixoDestino({ acao, funcionarioEnvolvido }) {
  const getForm = (codAcao) => {
    const formulario = {};
    if (codAcao !== constantes.solicitar) {
      formulario.funcaoPretendida = funcionarioEnvolvido.funcaoPretendida;
      formulario.oportunidade = funcionarioEnvolvido.oportunidade;
    }

    return <></>;
  };

  return (
    <>
      {funcionarioEnvolvido?.prefixoDestino ? (
        <Descriptions
          title="Destino"
          column={1}
          className={estilos.descricaoMetade}
          bordered
        >
          <Descriptions.Item
            label="Prefixo Destino"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.prefixoDestino
              ? `${funcionarioEnvolvido?.prefixoDestino?.prefixo} - ${funcionarioEnvolvido?.prefixoDestino?.nome}`
              : ''}
          </Descriptions.Item>
          <Descriptions.Item
            label="Super Destino"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.prefixoDestino
              ? `${funcionarioEnvolvido?.prefixoDestino?.prefixoSuper} - ${funcionarioEnvolvido?.prefixoDestino?.nomeSuper}`
              : ''}
          </Descriptions.Item>
          <Descriptions.Item
            label="Diretoria Destino"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.prefixoDestino
              ? `${funcionarioEnvolvido?.prefixoDestino?.prefixoDiretoria} - ${funcionarioEnvolvido?.prefixoDestino?.nomeDiretoria}`
              : ''}
          </Descriptions.Item>
          <Descriptions.Item
            label="Claros Destino"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.prefixoDestino?.clarosDestino}
          </Descriptions.Item>
          <Descriptions.Item
            label="Cód. Função Pretendida"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.funcaoPretendida}
          </Descriptions.Item>
          <Descriptions.Item
            label="Nome Função Pretendida"
            className={estilos.descricaoLinha}
          >
            {funcionarioEnvolvido?.nomeFuncaoPretendida}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
    </>
  );
}
