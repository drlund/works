import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

function Instrucoes({ onGetPareceres, loading }) {
  return (
    <Card
      type="inner"
      title="Instruções"
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={() => onGetPareceres()}
        >
          Atualizar pareceres
        </Button>
      }
    >
      <Typography.Paragraph>
        Os pareceres apresentados abaixo foram indicados pela equipe MTN. Eles
        estão divididos em duas seções:
      </Typography.Paragraph>
      <Typography.Paragraph>
        <ul>
          <li>
            <Typography.Text strong>Em lote:</Typography.Text> Casos nos quais a
            medida escolhida seguiu aquela prevista pela análise automatizada
            daquele caso específico. Para estes casos, é possível aprovar todas
            as medidas de uma só vez.
          </li>
          <li>
            <Typography.Text strong>Individuais:</Typography.Text> Casos nos
            quais a medida escolhida divergiu daquela prevista na análise
            automatizada daquele caso específico. Para estes casos, cada uma das
            análises precisa ser aprovada individualmente.
          </li>
        </ul>
      </Typography.Paragraph>
    </Card>
  );
}

export default Instrucoes;
