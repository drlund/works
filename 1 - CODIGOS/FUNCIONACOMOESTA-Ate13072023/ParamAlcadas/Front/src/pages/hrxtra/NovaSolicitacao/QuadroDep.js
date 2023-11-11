import React from 'react';
import { Card } from 'antd';
import QuadroDependencia from 'pages/designacao/Pendencias/QuadroDependencia';

function QuadroDep({ prefixo, nomePrefixo }) {
  return (
    <Card title={`Quadro da Dependencia - ${prefixo} ${nomePrefixo}`} headStyle={{ textAlign: 'center' }} bodyStyle={{ padding: '5px' }}>
      <QuadroDependencia prefixo={prefixo} />
    </Card>
  );
}

export default React.memo(QuadroDep);
