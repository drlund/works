import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';

import BBSpining from 'components/BBSpinning/BBSpinning';
import getPareceresPendentesAprovacao from './apiCalls/getPareceresPendentesAprovacao';


import Instrucoes from './Instrucoes';
import AprovacaoLote from './AprovacaoLote';
import AprovacaoIndividual from './AprovaçãoIndividual';

function AprovarMedida() {
  const [loading, setLoading] = useState(false);
  const [pareceresPendentes, setPareceresPendentes] = useState({
    lote: [],
    individuais: [],
  });

  const onGetPareceres = () => {
    setLoading(true);
    getPareceresPendentesAprovacao()
      .then((pareceres) => {
        setPareceresPendentes(pareceres);
      })
      .catch(() => {
        message.error('Erro ao recuperar lista de pareceres.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    onGetPareceres();
  }, []);

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Instrucoes onGetPareceres={onGetPareceres} loading={loading} />
        </Col>
        <Col span={24}>
          <AprovacaoLote
            pareceres={pareceresPendentes.lote}
            loading={loading}
            setLoading={setLoading}
            onGetPareceres={onGetPareceres}
          />
        </Col>
        <Col span={24}>
          <AprovacaoIndividual
            pareceres={pareceresPendentes.individuais}
            onGetPareceres={onGetPareceres}
            loading={loading}
            setLoading={setLoading}
          />
        </Col>
      </Row>
    </BBSpining>
  );
}

export default AprovarMedida;
