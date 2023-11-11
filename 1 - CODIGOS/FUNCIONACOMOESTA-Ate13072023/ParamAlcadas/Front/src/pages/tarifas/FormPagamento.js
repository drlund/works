import React from "react";
import { Row, Col, Select, Form, Input } from "antd";
const { TextArea } = Input;
const { Option } = Select;

function hasOnlyNumbers(testString) {
  var numbers = /^[0-9]+$/;
  return numbers.test(testString);
}

const FormPagamento = (props) => {
  const { dadosPagamento, setDadosPagamento, tiposPagamento } = props;
  const ESPECIE = tiposPagamento[0];

  // const onChangeCampo = (campo, valor) => {
  //   setDadosPagamento({ [campo]: valor });
  // };

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };

  return (
    <Row>
      <Col span={12}>
        <Row>
          <Col span={24}>
            <Form {...layout} labelAlign="left">
              <Form.Item label="Tipo de Pagamento">
                <Select
                  value={dadosPagamento.tipoPagamento}
                  defaultValue={ESPECIE}
                  style={{ width: 150 }}
                  onChange={(value) => {
                    setDadosPagamento({
                      ...dadosPagamento,
                      tipoPagamento: value,
                    });
                  }}
                >
                  {tiposPagamento.map((tipo) => {
                    return <Option value={tipo}>{tipo}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Form {...layout} labelAlign="left">
              <Form.Item label="Nr. Banco">
                <Input
                  value={dadosPagamento.nrBanco}
                  onChange={(e) => {
                    if (hasOnlyNumbers(e.target.value)) {
                      setDadosPagamento({
                        ...dadosPagamento,
                        nrBanco: e.target.value,
                      });
                    }
                  }}
                  style={{ width: 80 }}
                  disabled={dadosPagamento.tipoPagamento === ESPECIE}
                />
              </Form.Item>
              <Form.Item label="Agência (sem DV)">
                <Input
                  style={{ width: 150 }}
                  value={dadosPagamento.agencia}
                  disabled={dadosPagamento.tipoPagamento === ESPECIE}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || hasOnlyNumbers(value)) {
                      setDadosPagamento({
                        ...dadosPagamento,
                        agencia: value,
                      });
                    }
                  }}
                />
              </Form.Item>
              <Form.Item label="C/C (com DV)">
                <Input
                  value={dadosPagamento.conta}
                  style={{ width: 150 }}
                  disabled={dadosPagamento.tipoPagamento === ESPECIE}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isVazio = value.replace("-", "") === "";

                    if (isVazio || hasOnlyNumbers(value.replace("-", ""))) {
                      setDadosPagamento({
                        ...dadosPagamento,
                        conta: isVazio
                          ? ""
                          : value.replace("-", "").slice(0, -1) +
                            "-" +
                            value.replace("-", "").slice(-1),
                      });
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <TextArea
          value={dadosPagamento.observacoes}
          onChange={(e) => {
            setDadosPagamento({
              ...dadosPagamento,
              observacoes: e.target.value,
            });
          }}
          rows={8}
          placeholder="Informações adicionais que julgue necessário"
        />
      </Col>
    </Row>
  );
};

export default FormPagamento;
