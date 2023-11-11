import React, { useState } from "react";
import { Row, Col, DatePicker, Form, Button, message, Alert } from "antd";

import TabelaSolicitacoesParaReacao from "./TabelaSolicitacoesParaReacao";
import { fetchMinhasSolicitacoes } from "services/ducks/Encantar.ducks";
import moment from "moment";

const { RangePicker } = DatePicker;

const MinhasSolicitacoes = (props) => {
  const [filtros, setFiltros] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState(null);

  const { setLoading } = props;

  const pesquisarSolicitacoes = () => {
    if (!filtros || !filtros.periodoSolicitacao) {
      message.error("Informe o período");
      return;
    }
    setLoading(true);
    fetchMinhasSolicitacoes(filtros.periodoSolicitacao)
      .then((solicitacoes) => {
        setSolicitacoes(solicitacoes);
      })
      .catch((error) => message.error(error))
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <Row gutter={[0, 10]}>
      <Col span={24}>
        <Alert
          message={`Você poderá registrar reação para as solicitações solicitadas por
          algum funcionário lotado em seu prefixo ou para aquelas onde o seu
          prefixo foi indicado como prefixo fato.`}
          type="info"
        />
      </Col>
      <Col span={24}>
        <Form layout="inline">
          <Form.Item name={"periodoSolicitacao"} label={"Data Solicitação"}>
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(value) => setFiltros({ periodoSolicitacao: value })}
              allowEmpty={false}
              disabledDate={(currentDate) => {
                return currentDate.diff(moment()) > 0;
              }}
              showToday={false}
            />
          </Form.Item>

          <Button
            type="primary"
            onClick={() => {
              pesquisarSolicitacoes();
            }}
          >
            Pesquisar
          </Button>
        </Form>
      </Col>
      {solicitacoes && (
        <Col span={24}>
          <TabelaSolicitacoesParaReacao solicitacoesParaReacao={solicitacoes} />
        </Col>
      )}
    </Row>
  );
};

export default MinhasSolicitacoes;
