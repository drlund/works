import React from 'react';
import {Row, Col, Statistic} from 'antd';

import StyledCard from "components/styledcard/StyledCardPrimary";

const ResumoDicoi = props => {
  return (
    <StyledCard title="Resumo">
      <Row>
        <Col flex='auto' style={{textAlign: 'center'}}>
          <Statistic title="Análises" value={ props.resumo && props.resumo.qtdAnalises ?
              props.resumo.qtdAnalises :
              0
            }
          />
        </Col>
        <Col flex='auto' style={{textAlign: 'center'}}>
          <Statistic title="Fora do Prazo" value={ props.resumo && props.resumo.qtdForaPrazo ?
              props.resumo.qtdForaPrazo :
              0
            }
          />
        </Col>
        <Col flex='auto' style={{textAlign: 'center'}}>
          <Statistic title="MTNs" value={ props.resumo && props.resumo.qtdMtn ?
              props.resumo.qtdMtn :
              0
            }
          />
        </Col>
        <Col flex='auto' style={{textAlign: 'center'}}>
          <Statistic title="% Análises Fora do Prazo" value={ props.resumo && props.resumo.percentualForaPrazo ?
              props.resumo.percentualForaPrazo :
              0
            }
          />
        </Col>
      </Row>
    </StyledCard>
  );
}

export default ResumoDicoi;