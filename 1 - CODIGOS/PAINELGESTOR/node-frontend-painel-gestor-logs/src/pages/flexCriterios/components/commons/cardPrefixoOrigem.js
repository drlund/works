import React from 'react';
import { Descriptions } from 'antd';
import estilos from '../../flexCriterios.module.css';

export default function PrefixoOrigem({ funcionarioEnvolvido }) {
  return (
    <Descriptions
      title="Origem"
      column={1}
      className={estilos.descricaoMetade}
      bordered
    >
      <Descriptions.Item
        label="Prefixo Origem"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido
          ? `${funcionarioEnvolvido?.prefixoOrigem?.prefixo} - ${funcionarioEnvolvido?.prefixoOrigem?.nome}`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item
        label="Super Origem"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido
          ? `${funcionarioEnvolvido?.prefixoOrigem?.prefixoSuper} - ${funcionarioEnvolvido?.prefixoOrigem?.nomeSuper}`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item
        label="Diretoria Origem"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido
          ? `${funcionarioEnvolvido?.prefixoOrigem?.prefixoDiretoria} - ${funcionarioEnvolvido?.prefixoOrigem?.nomeDiretoria}`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item
        label="Claros Origem"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido?.prefixoOrigem?.clarosOrigem}
      </Descriptions.Item>
      <Descriptions.Item
        label="Cód. Função Atual"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido?.funcaoLotacao}
      </Descriptions.Item>
      <Descriptions.Item
        label="Nome Função Atual"
        className={estilos.descricaoLinha}
      >
        {funcionarioEnvolvido?.descricaoCargo}
      </Descriptions.Item>
    </Descriptions>
  );
}
