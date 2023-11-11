import React from 'react';
import TabelaResumo from 'pages/hrxtra/NovaSolicitacao/TabelaResumo';
import QuadroDep from 'pages/hrxtra/NovaSolicitacao/QuadroDep';
import { Card } from 'antd';

function ResumoGeral(props) {
  return (
    <Card title="Resumo Geral" headStyle={{textAlign: 'center', backgroundColor: '#002D4B', color: 'white'}}>
      <TabelaResumo key={props.prefixo} dadosHE={props.dadosHE} loading={props.loading} /><br />
      <QuadroDep prefixo={props.prefixo} nomePrefixo={props.nomePrefixo} />
    </Card>
  );
}

export default React.memo(ResumoGeral);