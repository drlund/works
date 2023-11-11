import React, { Component } from 'react';
import history from '../../../history';
import {
  Typography,
  Button,
  List,
  Collapse,
  Divider,
  message,
  Modal,
  Input,
  Tooltip,
  Affix
} from "antd";
import {
  RollbackOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import {
  updateEsclarecimento,
} from "services/ducks/Projetos.ducks";
import styles from "../projetos.module.css";
import { confirmarExclusao, tituloCurto } from "../Helpers/CommonsFunctions";
import { constantes } from "../Helpers/Constantes";

class EsclarecimentoLista extends Component {
  state = {
    id: null,
    resposta: null,
    soLeitura: false,
    exibirModal: false,
    ativo: null,
  };

  setDefaultValues = () => {
    this.setState({
      id: null,
      resposta: null,
      soLeitura: false,
      exibirModal: false,
      ativo: null,
    });
  };

  editarResposta = (id) => {
    this.setState({ exibirModal: true, id });
  };

  updateEsclarecimento = async () => {
    let mensagemSucesso = "A observação foi excluída.";
    let mensagemErro = "Não foi possível excluir a observação.";
    if (_.isNil(this.state.ativo)) {
      mensagemSucesso = "O pedido de esclarecimento foi respondido."
      mensagemErro = "Não foi possível gravar sua resposta."
    }
    if (_.isNil(this.state.ativo) && this.state.resposta.length < 8) {
      message.error("Escreva uma resposta com pelo menos 8 caracteres.");
      return;
    }
    try {
      await updateEsclarecimento({
        id: this.state.id,
        resposta: this.state.resposta,
        ativo: this.state.ativo
      });
      this.props.fetchProjetoById();
      this.setDefaultValues();
      message.success(mensagemSucesso);
    } catch (error) {
      message.error(mensagemErro);
    }
  };

  onExcluirEsclarecimento = item => {
    this.setState({ id: item.id, ativo: false });
    confirmarExclusao(
      item.id,
      this.updateEsclarecimento,
      "Tem certeza que deseja excluir este Esclarecimento/Observação?"
    )
  }

  renderActionList = (item) => {
    const acoes = [
      <Tooltip title="Remover">
        <Button
          type="text"
          className={styles.vermelho}
          onClick={() => this.onExcluirEsclarecimento(item) }
          icon={<DeleteOutlined />}
        />
      </Tooltip>
    ];
    if (!item.resposta && !JSON.parse(item.isObservacao)) {
      acoes.push(
        <Tooltip title="Responder">
          <Button
            type="text"
            className={styles.bbAzul}
            onClick={() => this.editarResposta(item.id)}
            icon={<RollbackOutlined />}
          />
        </Tooltip>
      );
    }
    return acoes;
  };

  renderEsclarecimentoRelacionado = (idRelacionado) => {
    const relacionado = this.props.esclarecimentos.find( esclarecimento => {
      return esclarecimento.id === idRelacionado
    })

    if (relacionado) {
      return (
        <Typography.Paragraph>
          <Typography.Text strong>Ligado ao Pedido:</Typography.Text> {
            `${relacionado.dtCriacao} -- ${tituloCurto(relacionado.pedido)}`
          }
        </Typography.Paragraph>
      );
    }
    return;
  }

  render() {
    return (
      <>
        <Divider>Esclarecimentos/Observações Cadastradas</Divider>
        <List
          dataSource={this.props.esclarecimentos}
          pagination={{
            size: "small",
            pageSize: 10,
            total: this.props.esclarecimentos.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} itens`,
          }}
          renderItem={(item) => (
            <List.Item actions={this.renderActionList(item)}>
              <List.Item.Meta
                title={
                  <Collapse expandIconPosition="end">
                    <Collapse.Panel
                      showArrow={false}
                      extra={
                        <Typography.Text className={styles.bbAzul}>
                          Detalhes
                        </Typography.Text>
                      }
                      header={
                        <Typography.Text strong>
                          {`Data: ${item.dtCriacao}  --  `}
                          { JSON.parse(item.isObservacao) ? 'Observação: ' : 'Solicitação: ' }
                          { tituloCurto(item.pedido) }
                        </Typography.Text>
                      }
                      key={item.titulo}
                    >
                      {this.renderEsclarecimentoRelacionado(item.idEsclarecimento)}
                      { JSON.parse(item.isObservacao) ?
                        <Typography.Paragraph>
                          <Typography.Text strong>Observação:</Typography.Text> {item.pedido}
                        </Typography.Paragraph>
                      : <>
                        <Typography.Paragraph>
                          <Typography.Text strong>Pedido:</Typography.Text> {item.pedido}
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                          <Typography.Text strong>
                            Indicado para responder:{" "}
                            {item.matriculaIndicadoResponder
                              ? `${item.matriculaIndicadoResponder} - ${item.nomeIndicadoResponder.nome}`
                              : "Nenhum responsável pelo projeto foi indicado."}
                          </Typography.Text>
                        </Typography.Paragraph>
                      </>
                      }
                      {item.resposta && (
                        <>
                          <Typography.Paragraph>
                            <Typography.Text
                              strong
                            >{`Respondido por: ${item.matriculaResposta} - ${item.nomeResposta.nome}`}
                            </Typography.Text>
                          </Typography.Paragraph>
                          <Typography.Paragraph>
                            <Typography.Text strong>
                              Resposta:{" "}
                            </Typography.Text>
                            {item.resposta}
                          </Typography.Paragraph>
                        </>
                      )}
                    </Collapse.Panel>
                  </Collapse>
                }
              />
            </List.Item>
          )}
        />
        <Modal
          title={"Escrever Resposta"}
          visible={this.state.exibirModal}
          onOk={()=>this.updateEsclarecimento(true)}
          okText="Responder"
          okButtonProps={{ className: styles.bbBGAzul }}
          onCancel={() =>
            this.setState({
              exibirModal: false,
              idEsclarecimento: null,
              resposta: null,
            })
          }
          cancelText="Cancelar"
          cancelButtonProps={{ type: "danger" }}
          width={600}
        >
          <Input.TextArea
            readOnly={this.props.soLeitura}
            value={this.state.resposta}
            onChange={(e) => {
              this.setState({ resposta: e.target.value });
            }}
          />
        </Modal>
        { !this.props.soLeitura && this.props.origemSolicitacao === constantes.ORIGEM_ABA_ESCLARECIMENTO &&
          <Affix style={{ position: "absolute", top: 70, right: 0 }}>
            <Tooltip title={constantes.BTN_FUNCIONALIDADE_INCLUSAO}>
              <Button
                type="primary"
                className={styles.bbBGAzul}
                onClick={ () => history.push(`/projetos/esclarecimento-projeto/${this.props.idProjeto}`) }
              >
                Adicionar
              </Button>
            </Tooltip>
          </Affix>
        }
      </>
    )
  }
}

export default EsclarecimentoLista;