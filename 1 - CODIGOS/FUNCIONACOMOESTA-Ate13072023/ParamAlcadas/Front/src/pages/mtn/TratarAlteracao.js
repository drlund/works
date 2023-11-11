import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, message, Skeleton, Divider } from "antd";
import { useParams } from "react-router-dom";
import { fetchMonitoramentoParaAlteracao } from "services/ducks/MtnComite.ducks";
import DadosMonitoramento from "./GerenciarMonitoramentos/DadosMonitoramento";
import BBSpining from "components/BBSpinning/BBSpinning";
import DadosVersaoAtual from "./GerenciarMonitoramentos/DadosVersaoAtual";
import DadosVotoAlteracao from "./TratarAlteracao/DadosVotoAlteracao";
import FormTratarPedidoAlteracao from "./TratarAlteracao/FormTratarPedidoAlteracao";

const TratarAlteracao = (props) => {
  const { idVersao } = useParams();

  const [loading, setLoading] = useState(false);
  const [dadosVersao, setDadosVersao] = useState(null);

  const onFetchDadosMonitoramento = useCallback(() => {
    setLoading(true);
    fetchMonitoramentoParaAlteracao(idVersao)
      .then((fetchedDadosVersao) => {
        message.success("Dados atualizados com sucesso");
        setDadosVersao(fetchedDadosVersao);
      })
      .catch((error) => {
        message.error("Erro ao recuperar dados");
      })
      .then(() => {
        setLoading(false);
      });
  }, [idVersao]);

  useEffect(() => {
    onFetchDadosMonitoramento();
  }, [onFetchDadosMonitoramento]);

  if (dadosVersao === null) {
    return (
      <BBSpining spinning={loading}>
        <Skeleton />
      </BBSpining>
    );
  }

  return (
    <BBSpining spinning={loading}>
      <Row gutter={[0, 20]} style={{ paddingBottom: 40 }}>
        <Col span={22} offset={1}>
          <Divider orientation="left">Dados Monitoramento</Divider>
        </Col>
        <Col span={22} offset={1}>
          <DadosMonitoramento dadosMonitoramento={dadosVersao.visao} />
        </Col>
        <Col span={10} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left">Versão Proposta</Divider>
            </Col>
            <Col span={24}>
              <DadosVersaoAtual versaoAtual={dadosVersao} />
            </Col>
          </Row>
        </Col>
        <Col span={10} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left">Pedido de Alteração</Divider>
            </Col>
            <Col span={24}>
              <DadosVotoAlteracao
                loading={loading}
                setLoading={setLoading}
                dadosVoto={dadosVersao.votoParaAlteracao}
              />
            </Col>
          </Row>
        </Col>
        <Col span={22} offset={1}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Divider orientation="left">Tratar Pedido</Divider>
            </Col>
            <Col span={24}>
              <FormTratarPedidoAlteracao
                loading={loading}
                setLoading={setLoading}
                idVersao={idVersao}
                onFetchDadosMonitoramento={onFetchDadosMonitoramento}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </BBSpining>
  );
};

export default TratarAlteracao;
