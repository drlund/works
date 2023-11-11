import React, { Component } from "react";
import StyledCardPrimary from "components/styledcard/StyledCardPrimary";
import { CheckOutlined } from "@ant-design/icons";
import "@ant-design/compatible/assets/index.css";
import { Form, Row, Col, Switch, DatePicker, Input } from "antd";
import { connect } from "react-redux";
import { ESTADOS, MATRIZ_COR_ESTADOS } from "../../Types";
import { updateDadosBasicos } from "services/ducks/OrdemServ.ducks";
import { debounce } from "throttle-debounce";
import moment from "moment";
import "moment/locale/pt-br";
import QuestionHelp from 'components/questionhelp'

class DadosBasicos extends Component {
  constructor(props) {
    super(props);
    this.textChangeDebounced = debounce(500, this.props.updateDadosBasicos);
  }

  onValidadeChange = (checked) => {
    let dataValidade = moment().toISOString();

    if (this.props.dadosBasicos.dataValidade) {
      dataValidade = this.props.dadosBasicos.dataValidade;
    }

    if (!checked) {
      //se for indeterminada nao precisa de data de validade
      dataValidade = null;
    }

    this.props.updateDadosBasicos({
      tipoValidade: checked ? "Determinada" : "Indeterminada",
      dataValidade,
    });
  };

  onDataValidadeChange = (data) => {
    if (data) {
      this.props.updateDadosBasicos({ dataValidade: data.toISOString() });
    } else {
      this.props.updateDadosBasicos({ dataValidade: moment().toISOString() });
    }
  };

  onTextChange = (e) => {
    this.textChangeDebounced({ [e.target.name]: e.target.value });
  };

  onConfidencialChange = (checked) => {
    this.props.updateDadosBasicos({ confidencial: checked ? 1 : 0 });
  }

  render() {
    let validateDateVisible =
      this.props.dadosBasicos.tipoValidade === "Determinada";
    let dataValidade = moment();
    let { dadosBasicos } = this.props;
    let permiteAlteracao =
      !dadosBasicos.estado || dadosBasicos.estado === ESTADOS.RASCUNHO;

    if (moment(this.props.dadosBasicos.dataValidade).isValid()) {
      dataValidade = moment(this.props.dadosBasicos.dataValidade);
    }

    return (
      <StyledCardPrimary
        noShadow={false}
        bodyStyle={{ padding: "12px 24px 12px 24px" }}
        title={
          <Row>
            <Col span={12}>Informações Gerais</Col>
          </Row>
        }
      >
        {dadosBasicos.numero && (
          <Form
            layout="horizontal"
            labelCol={{ sm: { span: 22 }, md: { spam: 2 }, lg: { span: 2 } }}
            wrapperCol={{ span: 22 }}
            labelAlign="left"
          >
            <Form.Item
              label="Número da O.S"
              style={{ fontWeight: "bold", marginBottom: 0 }}
            >
              <span className="ant-page-header-title-view-title">
                {dadosBasicos.numero}
              </span>
            </Form.Item>
          </Form>
        )}

        <Form
          layout="horizontal"
          labelCol={{ sm: { span: 22 }, md: { spam: 2 }, lg: { span: 2 } }}
          wrapperCol={{ span: 22 }}
          labelAlign="left"
        >
          <Form.Item
            label="Estado Atual"
            style={{ fontWeight: "bold", marginBottom: 0 }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    marginRight: "10px",
                    color: MATRIZ_COR_ESTADOS[dadosBasicos.estado],
                  }}
                  className="ant-page-header-title-view-title"
                >
                  {dadosBasicos.nomeEstado || "RASCUNHO"}
                </span>
              </div>
              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <span>
                  <span style={{ marginRight: "10px" }}>
                    Confidencial?
                    <QuestionHelp 
                      title="Caso a ordem seja marcada como confidencial, apenas os designantes, os designados e os colaboradores poderão visualizar os dados da ordem. 
                             Funcionários com nível gerencial do mesmo prefixo não terão acesso aos dados desta ordem para consulta."
                      style={{marginLeft: 20}} 
                      contentWidth={550}
                      placement="bottomRight"
                    />
                  </span>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    onChange={this.onConfidencialChange}
                    defaultChecked={dadosBasicos.confidencial === 1}
                    disabled={!permiteAlteracao && !this.props.isDesignante}
                  />
                </span>
              </div>
            </div>
          </Form.Item>
        </Form>

        <Form
          layout="horizontal"
          labelCol={{ sm: { span: 22 }, md: { spam: 2 }, lg: { span: 2 } }}
          wrapperCol={{ span: 22 }}
          labelAlign="left"
          colon={false}
        >
          <Form.Item label="Validade" style={{ marginBottom: 0 }}>
            <span style={{ marginRight: "10px" }}>Indeterminada</span>
            <Switch
              checkedChildren={<CheckOutlined />}
              onChange={this.onValidadeChange}
              defaultChecked={validateDateVisible}
              disabled={!permiteAlteracao}
            />
            <span style={{ paddingLeft: "10px", paddingRight: "15px" }}>
              Determinada
            </span>

            {validateDateVisible && (
              <DatePicker
                defaultValue={dataValidade}
                disabled={!permiteAlteracao}
                format="DD/MM/YYYY"
                showToday
                allowClear={false}
                disabledDate={(current) =>
                  current < moment().subtract(1, "day")
                }
                onChange={this.onDataValidadeChange}
              />
            )}
          </Form.Item>
        </Form>

        <Form layout="vertical" style={{ paddingTop: 10 }}>
          <Form.Item label="Título">
            <Input
              autoComplete={"off"}
              name="titulo"
              disabled={!permiteAlteracao}
              onChange={(e) => this.onTextChange(e)}
              defaultValue={dadosBasicos.titulo || ""}
            />
          </Form.Item>
          <Form.Item label="Descrição">
            <Input.TextArea
              rows={5}
              name="descricao"
              onChange={(e) => this.onTextChange(e)}
              disabled={!permiteAlteracao}
              defaultValue={dadosBasicos.descricao || ""}
            />
          </Form.Item>
        </Form>
      </StyledCardPrimary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dadosBasicos: state.ordemserv.ordemEdicao.dadosBasicos,
    isDesignante: state.ordemserv.ordemEdicao.isDesignante,
  };
};

export default connect(mapStateToProps, {
  updateDadosBasicos,
})(DadosBasicos);
