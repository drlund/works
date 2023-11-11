import React from 'react';
import { Descriptions } from 'antd';
import _ from 'lodash';

import StyledCardPrimary from 'components/styledcard/StyledCard';

const { Item } = Descriptions;

export default function Destino({ dados }) {
  if (_.isNil(dados)) {
    return null;
  }

  return (
    <StyledCardPrimary
      title="Destino"
      headStyle={
        {
          textAlign: 'center', fontWeight: 'bold', background: '#74B4C4', fontSize: '1.3rem', width: '100%'
        }
      }
      bodyStyle={{ padding: 5 }}
    >
      <Descriptions column={1} bordered size="small">
        <Item label="_" />
        {
          dados.cod_comissao
          && (
            <Item label="Função">
              {dados.cod_comissao}
              {' '}
              {dados.nome_comissao}
            </Item>
          )
        }
        <Item label="Dependência">
          {dados.prefixo}
          {' '}
          {dados.dependencia}
        </Item>
        <Item label="Município">{dados.municipioUf}</Item>
        <Item label="Nível">{dados.nivel_alfab}</Item>
        <Item label="Super">
          {dados.cd_super_juris}
          {' '}
          {dados.nome_super}
        </Item>
        {
          dados.cod_comissao
          && (
            <Item
              label="CPA Exigida"
            >
              {_.isNil(dados.cpa.certificacao_exigida)
                ? dados.cpa.map((elem) => elem.certificacao_exigida).toString()
                : dados.cpa.certificacao_exigida}
            </Item>
          )
        }
      </Descriptions>
    </StyledCardPrimary>
  );
}
