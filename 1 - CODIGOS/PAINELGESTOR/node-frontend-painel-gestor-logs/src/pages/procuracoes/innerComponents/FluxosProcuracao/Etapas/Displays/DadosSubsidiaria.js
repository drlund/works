import { Descriptions, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

/**
 * @param {{ subsidiaria: Procuracoes.SubsidiariaCadastro }} props
 */
const DadosSubsidiaria = ({ subsidiaria }) => {
  if (!subsidiaria) {
    return null;
  }

  return (
    <Descriptions layout="vertical">
      <Descriptions.Item label={<Text strong>Nome</Text>}>
        {subsidiaria.nome}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>CNPJ</Text>}>
        {subsidiaria.cnpj}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>Endereço</Text>}>
        {subsidiaria.endereco}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>Complemento</Text>}>
        {subsidiaria.complemento}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>CEP</Text>}>
        {subsidiaria.cep}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>Bairro</Text>}>
        {subsidiaria.bairro}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>Município</Text>}>
        {subsidiaria.municipio}
      </Descriptions.Item>
      <Descriptions.Item label={<Text strong>UF</Text>}>
        {subsidiaria.uf}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DadosSubsidiaria;
