import React, { Component } from "react";
import { Modal, Divider, Switch, Form, Space, Tooltip, Select, Input, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import uuid from "uuid/v4";
import { fetchProjeto } from "services/ducks/Projetos.ducks";
import { validarInput, renderDropDown, renderDropDownPausa } from "../Helpers/CommonsFunctions";
import { constantes } from "../Helpers/Constantes";
import styles from "../projetos.module.css";

class ModalPausarAtividade extends Component {
  state={
    isVinculada: true,
    idProjetoGeradorPausa: null,
    idProjetoGeradorPausaCheck: null,
    idAtividadeGeradoraPausa: null,
    idAtividadeGeradoraPausaCheck: null,
    idFuncionalidadeGeradoraPausa: null,
    listaFuncionalidadeGeradoraPausa: [],
    listaAtividadeGeradoraPausa: [],
    tituloPausa: null,
    tituloPausaCheck: null,
    descricaoPausa: null,
    descricaoPausaCheck: null,
    prazoPausa: null,
    prazoPausaCheck: null,
  }

  setDefaultValues = () => {
    this.setState({
      isVinculada: true,
      idProjetoGeradorPausa: null,
      idProjetoGeradorPausaCheck: null,
      idAtividadeGeradoraPausa: null,
      idAtividadeGeradoraPausaCheck: null,
      idFuncionalidadeGeradoraPausa: null,
      listaFuncionalidadeGeradoraPausa: [],
      listaAtividadeGeradoraPausa: [],
      tituloPausa: null,
      tituloPausaCheck: null,
      descricaoPausa: null,
      descricaoPausaCheck: null,
      prazoPausa: null,
      prazoPausaCheck: null,
    })
  }

  clearPausaForm = () => {
    this.setDefaultValues();
    this.props.onCancelFunction(false);
    return;
  }

  isAtividadeRegistradaNoBD = idAtividade => {
    return typeof idAtividade === 'number'
  }

  carregarDadosOrigemPausa = async idProjeto => {
    try {
      let projeto = await fetchProjeto(idProjeto);
      this.setState({
        idProjetoGeradorPausa: idProjeto,
        idProjetoGeradorPausaCheck: validarInput(idProjeto.toString()),
        listaFuncionalidadeGeradoraPausa: projeto.funcionalidades,
        listaAtividadeGeradoraPausa: projeto.atividades,
      })
    } catch (error) {
      message.error('Não foi possível obter a lista de projetos. Salve os dados e recarregue o App.')
    }
  }

  onSelectedPausa = valor => {
    const geradorPausa = this.state.listaAtividadeGeradoraPausa.find( atividade => {
      return atividade.id === valor;
    })

    if(this.isAtividadeRegistradaNoBD(geradorPausa.id)) {
      this.setState({
        idAtividadeGeradoraPausa: geradorPausa.id,
        idAtividadeGeradoraPausaCheck: validarInput(geradorPausa.id.toString()),
        prazoPausa: geradorPausa.prazo,
        prazoPausaCheck: validarInput(geradorPausa.prazo.toString())
      })
    } else {
      message.error(constantes.MSG_ATIVIDADE_FORA_BD)
    }

  }

  checkFormPausa = () => {
    let projeto = this.state.idProjetoGeradorPausaCheck;
    let atividade = this.state.idAtividadeGeradoraPausaCheck;
    const titulo = this.state.tituloPausaCheck !== "success" ? 'error' : this.state.tituloPausaCheck;
    const descricao = this.state.descricaoPausaCheck !== "success" ? 'error' : this.state.descricaoPausaCheck;
    const prazo = this.state.prazoPausaCheck !== "success" ? 'error' : this.state.prazoPausaCheck;
    let resultado = true;
    
    if(this.state.isVinculada) {
      projeto = this.state.idProjetoGeradorPausaCheck !== "success" ? 'error' : this.state.idProjetoGeradorPausaCheck;
      atividade = this.state.idAtividadeGeradoraPausaCheck !== "success" ? 'error' : this.state.idAtividadeGeradoraPausaCheck;
    }
    if(projeto === "error" || atividade === "error" ||titulo !== "success" || descricao !== "success" || prazo !== "success") {
      resultado = false;
    }
    this.setState({ 
      idProjetoGeradorPausaCheck: projeto,
      idAtividadeGeradoraPausaCheck: atividade,
      tituloPausaCheck: titulo,
      descricaoPausaCheck: descricao,
      prazoPausaCheck: prazo,
    });

    return resultado;
  }

  incluirPausa = async () => {
    if(!this.checkFormPausa()) return message.error("Os campos destacados devem ser preenchidos.");
    await this.props.onOkFunction(
      {
        id: uuid(),
        idAtividadePausada: this.props.idAtividadePausada,
        idAtividadeGeradoraPausa: this.state.idAtividadeGeradoraPausa,
        titulo: this.state.tituloPausa,
        descricao: this.state.descricaoPausa,
        prazo: this.state.prazoPausa,
      }
    );
    this.setDefaultValues();
    this.props.onCancelFunction(false);
    return;
  }

  render() {
    return (
      <Modal
        title={"Pausar atividade"}
        visible={this.props.exibirModalPausa}
        onOk={this.incluirPausa}
        okText={"Incluir"}
        okButtonProps={{ className: styles.bbBGAzul }}
        onCancel={this.clearPausaForm}
        cancelText="Cancelar"
        cancelButtonProps={{ type: "danger" }}
        width="70%"
      >
        <Divider>
          Pausa Vinculada à outra Atividade{" "}
          <Switch
            checkedChildren="Sim"
            unCheckedChildren="Não"
            checked={this.state.isVinculada}
            onChange={(check) => {
              this.setState({
                isVinculada: check,
                idProjetoGeradorPausa: null,
                idAtividadeGeradoraPausa: null,
              });
            }}
          />
        </Divider>
        {this.state.isVinculada && (
          <>
            <Form.Item
              style={{ justifyContent: "flex-end", maxWidth: "90%" }}
              {...constantes.layoutForm}
              label={
                <Space>
                  {constantes.LABEL_GERADOR_PAUSA_PROJETO}
                  <Tooltip title={constantes.INFO_GERADOR_PAUSA_PROJETO}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              hasFeedback
              validateStatus={this.state.idProjetoGeradorPausaCheck}
            >
              <Select
                value={this.state.idProjetoGeradorPausa}
                onChange={(valor) => this.carregarDadosOrigemPausa(valor)}
              >
                {renderDropDown(
                  "projetos", 
                  this.props.projetos.filter(
                    funcionalidade => typeof funcionalidade.id === 'number'
                  )
                )}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ justifyContent: "flex-end", maxWidth: "90%" }}
              {...constantes.layoutForm}
              label={
                <Space>
                  {constantes.LABEL_GERADORA_PAUSA_ATIVIDADE}
                  <Tooltip title={constantes.INFO_GERADORA_PAUSA_ATIVIDADE}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              hasFeedback
              validateStatus={this.state.idAtividadeGeradoraPausaCheck}
            >
              <Select 
                value={this.state.idAtividadeGeradoraPausa}
                onChange={(valor) => this.onSelectedPausa(valor)}
              >
                {renderDropDownPausa(this.state.listaAtividadeGeradoraPausa)}
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_TITULO_ATIVIDADE}
              <Tooltip title={constantes.INFO_TITULO_PAUSA_ATIVIDADE}>
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          }
          validateStatus={this.state.tituloPausaCheck}
          hasFeedback
        >
          <Input
            value={this.state.tituloPausa}
            onChange={(e) => {
              this.setState({ tituloPausa: e.target.value });
            }}
            onBlur={(e) => {
              this.setState({ tituloPausaCheck: validarInput(e.target.value) });
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_DESCRICAO_ATIVIDADE}
              <Tooltip title={constantes.INFO_DESCRICAO_PAUSA_ATIVIDADE}>
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          }
          validateStatus={this.state.descricaoPausaCheck}
          hasFeedback
        >
          <Input.TextArea
            value={this.state.descricaoPausa}
            // autoSize={true}
            onChange={(e) => {
              this.setState({ descricaoPausa: e.target.value });
            }}
            onBlur={(e) => {
              this.setState({
                descricaoPausaCheck: validarInput(e.target.value),
              });
            }}
          />
        </Form.Item>
        <Form.Item
          style={{ justifyContent: "flex-end", maxWidth: "90%" }}
          {...constantes.layoutForm}
          label={
            <Space>
              {constantes.LABEL_PRAZO_ATIVIDADE}
              <Tooltip title={constantes.INFO_PRAZO_PAUSA_ATIVIDADE}>
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
          }
          hasFeedback
          validateStatus={this.state.prazoPausaCheck}
        >
          <Input
            value={this.state.prazoPausa}
            type='number'
            onChange={(e) => {
              this.setState({ prazoPausa: e.target.value });
            }}
            onBlur={(e) => {
              this.setState({ 
                prazoPausaCheck: validarInput(this.state.prazoPausa) 
              });
            }}
          />
        </Form.Item>
      </Modal>
    );
  }
}
export default ModalPausarAtividade;
