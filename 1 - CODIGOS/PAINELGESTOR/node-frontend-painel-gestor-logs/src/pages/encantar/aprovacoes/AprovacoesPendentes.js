import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Radio, Button } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import commonColumns from "./commonColumns.js";
import SearchTable from "components/searchtable/SearchTable";
import { fetchSolicitacoesParaAprovacao } from "services/ducks/Encantar.ducks";


const AprovacoesAndamento = (props) => {
  const [tipoPendencia, setTipoPendencia] = useState("somentePrefixo");
  const [pendencias, setPendencias] = useState(null);

  const getAprovacoesAndamento = useCallback((tipoPendenciaRecebida) => {
    return fetchSolicitacoesParaAprovacao(tipoPendenciaRecebida);
  }, []);

  useEffect(() => {
    if (pendencias === null) {
      getAprovacoesAndamento(tipoPendencia).then((aprovacoesPendentes) => {
        setPendencias(aprovacoesPendentes);
      });
    }
  }, [pendencias, getAprovacoesAndamento, tipoPendencia]);

  return (
    <BBSpinning spinning={pendencias === null}>
      <Row gutter={[0, 30]} style={{marginTop: 10}}>
        <Col span={24}>
          <Radio.Group
            onChange={(e) => setTipoPendencia(e.target.value)}
            value={tipoPendencia}
          >
            <Radio value={"somentePrefixo"}>Somente no meu prefixo</Radio>
            <Radio value={"todosDoFluxo"}>Todos onde estou no fluxo</Radio>
          </Radio.Group>
          <Button onClick={() => setPendencias(null)} type={"primary"}>Pesquisar</Button>
        </Col>
        <Col span={24}>
          <SearchTable
            columns={commonColumns}
            dataSource={pendencias}
            size="small"
            pagination={{ showSizeChanger: true }}
          />
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default AprovacoesAndamento;
