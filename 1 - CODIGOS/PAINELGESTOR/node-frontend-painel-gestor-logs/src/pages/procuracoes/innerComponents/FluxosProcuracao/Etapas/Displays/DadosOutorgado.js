import { Descriptions, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

/**
 * @param {{outorgado: Funci}} props
 */
const DadosOutorgado = ({ outorgado }) => {
  if (!outorgado) {
    return null;
  }

  return (
    <>
      <Descriptions layout="vertical">
        <Descriptions.Item
          label={<Text strong>Nome</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.nome}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>Matrícula</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.matricula}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>CPF</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.cpf}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>RG</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.rg}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>Estado Civil</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.estCivil}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>Cargo</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.descFuncLotacao}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="Lotação" layout="vertical">
        <Descriptions.Item
          label={<Text strong>Prefixo</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {`${outorgado.dependencia.prefixo} - ${outorgado.dependencia.nome}`}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>Município</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.dependencia.municipio}
        </Descriptions.Item>
        <Descriptions.Item
          label={<Text strong>UF</Text>}
          style={{ fontWeight: 'normal' }}
        >
          {outorgado.dependencia.uf}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DadosOutorgado;
