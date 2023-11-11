import React, { useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import {
  Button, Skeleton, Timeline, Typography
} from 'antd';
import { BoldLabelDisplay } from 'components/BoldLabelDisplay';

const { Text } = Typography;

export function TimelineBody({ error, loading, historico }) {
  const [showAll, setShowAll] = useState(false);
  if (error) { return <Text type="danger">Houve um erro ao buscar o histórico. Recarregue a página e tente novamente.</Text>; }

  return (
    <Skeleton active loading={loading}>
      <strong style={{ fontSize: '1.1em', marginBottom: '1em', display: 'inline-block' }}>
        Linha do Tempo
      </strong>
      <Timeline>
        {historico
          ?.sort(((a, b) => new Date(b.data) - new Date(a.data)))
          .slice(0, showAll ? historico.length : 5)
          .map((item) => (
            <Timeline.Item key={item.data}>
              <BoldLabelDisplay label={timelineDisplay[item.tipo] || item.tipo} />
              <Text style={{ display: 'block' }}>{item.data}</Text>
              <Text style={{ display: 'block' }}>{`${item.funci.chave} - ${item.funci.nome}`}</Text>
              <Text style={{ display: 'block' }}>{item.funci.cargo}</Text>
            </Timeline.Item>
          )) || <Text type="warning">Não foi encontrato o histórico para essa procuração.</Text>}
        {historico && historico.length > 5 && !showAll && (
          <Timeline.Item>
            <Button onClick={() => setShowAll(true)} icon={<MoreOutlined />}>
              Mostrar todos
            </Button>
          </Timeline.Item>
        )}
      </Timeline>
    </Skeleton>
  );
}
const timelineDisplay = {
  cadastro: 'Cadastramento da Procuração',
  alteracao: 'Alteração da Procuração',
  exclusao: 'Exclusão da Procuração'
};
