import React, { useEffect, useState } from 'react';
import { Card, message, Steps } from 'antd';
import { configEtapas } from 'pages/flexCriterios/helpers/funcoesAuxiliares';
import { getEtapas } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';

export default function Etapas({ etapaAtual }) {
  const [etapas, setEtapas] = useState([]);
  useEffect(() => {
    getEtapas()
      .then((listaEtapas) => {
        setEtapas(listaEtapas);
      })
      .catch(() => {
        message.error('Não foi possível recuperar as etapas deste pedido.');
      });
  }, []);
  return (
    <Card>
      {etapas && <Steps current={etapaAtual} items={configEtapas(etapas)} />}
    </Card>
  );
}
