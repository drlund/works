import React from 'react';
import { Descriptions, Row, Col } from 'antd';
import _ from 'lodash';
import { CloseSquareFilled, CheckCircleFilled } from '@ant-design/icons';

import StyledCardPrimary from 'components/styledcard/StyledCard';

const { Item } = Descriptions;

function Resultado({
  dados,
  larger,
}) {
  const cor = _.isEmpty(dados.negativas) ? '#74B4C4' : '#FB630B';

  return (
    <StyledCardPrimary
      title="Resultado da Análise"
      headStyle={{
        textAlign: 'center',
        fontWeight: 'bold',
        background: `${cor}`,
        fontSize: '1.3rem'
      }}
      bodyStyle={{ padding: 5 }}
    >
      <Descriptions column={1} bordered size={larger ? 'default' : 'small'}>
        {
          dados.analise.map((analise) => {
            const chave = _.head(Object.keys(analise));
            return (
              <Item key={analise[chave].nome} label={analise[chave].label}>
                <Row>
                  <Col span={22}>{analise[chave].valor}</Col>
                  <Col span={2}>{_.isEmpty(_.intersection([chave], dados.negativas)) ? <CheckCircleFilled style={{ color: 'green' }} /> : <CloseSquareFilled style={{ color: 'red' }} />}</Col>
                </Row>
              </Item>
            );
          })
        }
      </Descriptions>
    </StyledCardPrimary>
  );
}

export default React.memo(Resultado);
