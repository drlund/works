import React, { useState } from "react";
import { Form, Input, DatePicker, Button, Row, Col, message } from "antd";

import { fetchPareceresFinalizados } from "services/ducks/Mtn.ducks";
import { useDispatch } from "react-redux";
import moment from "moment";

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const MtnFormReverter = props => {

  //HOOKS
  const [filtros, setFiltros] = useState({
    periodoInicio: moment().subtract(1, "month"),
    periodoFim: moment(),
  });
  
  const dispatch = useDispatch();

  const pesquisarPareceres = async () => {
    props.loadingFunc(true);
    await fetchPareceresFinalizados(filtros, dispatch)
      .then(() => {
        props.loadingFunc(false);

      })
      .catch((erro) => {
        message.error(erro);
      });
  };

  const atualizaFiltro = (filtro, valor) => {
    setFiltros((prevState) => {
      if (valor !== "") {
        return { ...prevState, [filtro]: valor };
      } else {
        const newState = { ...prevState };
        delete newState[filtro];
        return newState;
      }
    });
  };

  return (
    <Row gutter={[0, 30]} align="middle">
      <Col span={24}>
        <Form {...formLayout} layout="inline">
          <Form.Item label="Nr. Mtn">
            <Input
              onBlur={(e) => atualizaFiltro("nrMtn", e.target.value)}
              placeholder="0000000000000"
            />
          </Form.Item>
          <Form.Item label="Matrícula Envolvido">
            <Input
              onBlur={(e) =>
                atualizaFiltro("matriculaEnvolvido", e.target.value)
              }
              placeholder="F0000000"
            />
          </Form.Item>
          <Form.Item label="Matrícula Analista">
            <Input
              onBlur={(e) =>
                atualizaFiltro("matriculaAnalista", e.target.value)
              }
              placeholder="F0000000"
            />
          </Form.Item>
          <Form.Item label="Período Início">
            <DatePicker
              format={"DD/MM/YYYY"}
              defaultValue={filtros.periodoInicio}
              onChange={(date) => atualizaFiltro("periodoInicio", date)}
            />
          </Form.Item>
          <Form.Item label="Período Fim">
            <DatePicker
              format={"DD/MM/YYYY"}
              defaultValue={filtros.periodoFim}
              onChange={(date) => atualizaFiltro("periodoFim", date)}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
        <Button type="primary" onClick={pesquisarPareceres}>
          Pesquisar
        </Button>
      </Col>
    </Row>
  );
};

export default MtnFormReverter;
