import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import Filtros from './Filtros';
import OcorrenciasPesquisadas from './OcorrenciasPesquisadas';
import moment from 'moment';

import pesquisarOcorrenciasParaReverter from '../apiCalls/pesquisarOcorrenciasParaReverter';

const PesquisarOcorrencia = () => {
  const [filtros, setFiltros] = useState({ nrMtn: '', matriculaEnvolvido: '' });
  const [ocorrencias, setOcorrencias] = useState([]);

  const onPesquisarOcorrencias = ({
    nrMtn,
    matriculaEnvolvido,
    matriculaAnalista,
    periodoPesquisa,
  }) => {
    const dadosFiltros = {
      nrMtn: nrMtn ? nrMtn : null,
      matriculaEnvolvido: matriculaEnvolvido ? matriculaEnvolvido : null,
      matriculaAnalista: matriculaAnalista ? matriculaAnalista : null,
      periodoPesquisa: Array.isArray(periodoPesquisa)
        ? [
            moment(periodoPesquisa[0]).format('YYYY-MM-DD'),
            moment(periodoPesquisa[1]).format('YYYY-MM-DD'),
          ]
        : null,
    };
    pesquisarOcorrenciasParaReverter(dadosFiltros)
      .then((ocorrencias) => {
        setOcorrencias(ocorrencias);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <Card>
          <Filtros
            filtros={filtros}
            setFiltros={setFiltros}
            onPesquisarOcorrencias={onPesquisarOcorrencias}
          />
        </Card>
      </Col>
      {Array.isArray(ocorrencias) && ocorrencias.length > 0 ? (
        <Col span={24}>
          <Card>
            <OcorrenciasPesquisadas
              ocorrencias={ocorrencias}
              setOcorrencias={setOcorrencias}
            />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
};

export default PesquisarOcorrencia;
