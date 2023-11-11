import React from 'react';
import {
  Button,
  Card,
  Typography
} from 'antd';
import uuid from 'uuid';
import useSetState from 'hooks/useSetState';
import ValidacaoCard from './ValidacaoCard';

function ValidacaoRH() {
  const [chave, setChave] = useSetState(uuid());

  const limparCampos = () => {
    const uuuid = uuid();
    setChave(uuuid);
  };

  return (
    <Card
      title={<Typography.Title level={1}>Validação RH</Typography.Title>}
      extra={<Button onClick={limparCampos}>Limpar</Button>}
    >
      <ValidacaoCard key={chave} chave={chave} />
    </Card>
  );
}

export default ValidacaoRH;
