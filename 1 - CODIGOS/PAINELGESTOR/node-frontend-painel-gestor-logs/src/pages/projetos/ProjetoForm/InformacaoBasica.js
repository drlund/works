import React, { Component } from "react";
import { Form, Input, Tooltip, Space, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { validarInput, } from "../Helpers/CommonsFunctions";
import { constantes } from "../Helpers/Constantes";
const { Option } = Select;
class InformacaoBasica extends Component {
  render() {
    const informacaoBasica = this.props.informacaoBasica;
    const inputsChecks = this.props.inputsChecks;
    return (
      <>
        {constantes.TEXTO_INFO_BASICA}
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_TITULO_INFO_BASICA}
              <Tooltip title={constantes.INFO_TITULO_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.tituloCheck}
          hasFeedback
        >
          <Input
            readOnly={this.props.soLeitura}
            value={informacaoBasica.titulo}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                { ...informacaoBasica,
                'titulo': e.target.value }
              )
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'tituloCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_RESUMO_INFO_BASICA}
              <Tooltip title={constantes.INFO_RESUMO_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.resumoCheck}
          hasFeedback
        >
          <Input.TextArea
            readOnly={this.props.soLeitura}
            value={informacaoBasica.resumo}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                {...informacaoBasica,
                "resumo": e.target.value}
              );
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'resumoCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_OBJETIVO_INFO_BASICA}
              <Tooltip title={constantes.INFO_OBJETIVO_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.objetivoCheck}
          hasFeedback
        >
          <Input.TextArea
            readOnly={this.props.soLeitura}
            value={informacaoBasica.objetivo}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                {...informacaoBasica,
                'objetivo': e.target.value}
              );
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'objetivoCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_PESSOAS_INFO_BASICA}
              <Tooltip title={constantes.INFO_PESSOAS_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.qtdePessoasCheck}
          hasFeedback
        >
          <Input
            readOnly={this.props.soLeitura}
            value={informacaoBasica.qtdePessoas}
            maxLength={50}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                { ...informacaoBasica,
                'qtdePessoas': e.target.value }
              )
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'qtdePessoasCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_TEMPO_INFO_BASICA}
              <Tooltip title={constantes.INFO_TEMPO_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.reducaoTempoCheck}
          hasFeedback
        >
          <Input
            readOnly={this.props.soLeitura}
            value={informacaoBasica.reducaoTempo}
            maxLength={50}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                { ...informacaoBasica,
                'reducaoTempo': e.target.value }
              )
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'reducaoTempoCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_CUSTO_INFO_BASICA}
              <Tooltip title={constantes.INFO_CUSTO_INFO_BASICA}><InfoCircleOutlined /></Tooltip>
            </Space>
          }
          validateStatus={inputsChecks.reducaoCustoCheck}
          hasFeedback
        >
          <Input
            readOnly={this.props.soLeitura}
            value={informacaoBasica.reducaoCusto}
            maxLength={50}
            onChange={(e) => {
              this.props.onUpdateState(
                'informacaoBasica',
                { ...informacaoBasica,
                'reducaoCusto': e.target.value }
              )
            }}
            onBlur={(e) => {
              this.props.onUpdateState(
                'inputsChecks',
                {...inputsChecks,
                'reducaoCustoCheck': validarInput(e.target.value)}
              );
            }}
          />
        </Form.Item>
        { this.props.perfilAcesso && this.props.perfilAcesso.includes('ADM') && (
          <Form.Item
            style={{ justifyContent: "flex-end", maxWidth: "90%" }}
            {...constantes.layoutForm}
            label={
              <Space>
                {constantes.LABEL_STATUS_ATIVIDADE}
                <Tooltip title={constantes.INFO_STATUS_PROJETO}><InfoCircleOutlined /></Tooltip>
              </Space>
            }
            hasFeedback
          >
            <Select
              value={informacaoBasica.idStatus}
              onChange={ valor => {
                this.props.onUpdateState(
                  'informacaoBasica',
                  {...informacaoBasica,
                  idStatus: valor}
                )
              }}
            >
              {this.props.status.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.descricao}
                  </Option>
                )}
              )}
            </Select>
          </Form.Item>
        )}
      </>
    );
  }
}

export default InformacaoBasica;
