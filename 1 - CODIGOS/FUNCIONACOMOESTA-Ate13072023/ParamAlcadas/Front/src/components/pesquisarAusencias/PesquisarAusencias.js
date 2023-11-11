import React, { useState } from "react";
import { Row, Col, message } from "antd";
import FormAusencias from "./FormAusencias";
import TabelaAusencias from "./TabelaAusencias";
import BBSpining from "components/BBSpinning/BBSpinning";

const PesquisarAusencias = (props) => {
  const {
    defaultPeriodo,
    loading,
    setLoading,
    defaultMatricula,
    disableMatricula,
    fetchAusenciasFunci
  } = props;
  const [dadosAusencia, setDadosAusencia] = useState(null);

  const onPesquisarAusencias = ({ matricula, periodo }) => {
    setLoading(true);
    fetchAusenciasFunci({ matricula, periodo })
      .then((ausenciasRecebidas) => {
        setDadosAusencia(ausenciasRecebidas);
      })
      .catch(() => {
        message.error("Erro ao pesquisar as ausências");
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <BBSpining spinning={loading}>
      <Row>
        <Col span={24}>
          <FormAusencias
            disableMatricula={disableMatricula}
            defaultPeriodo={defaultPeriodo}
            defaultMatricula={defaultMatricula}
            onPesquisarAusencias={onPesquisarAusencias}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <TabelaAusencias dadosAusencia={dadosAusencia} />
        </Col>
      </Row>
    </BBSpining>
  );
};

export default PesquisarAusencias;
