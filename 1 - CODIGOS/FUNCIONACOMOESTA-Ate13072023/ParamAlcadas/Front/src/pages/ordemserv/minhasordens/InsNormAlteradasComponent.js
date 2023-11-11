import React, { Component } from 'react'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Descriptions, Button, Modal, message } from 'antd';
import StyledCard from 'components/styledcard/StyledCard';
import { MATRIZ_COR_ESTADOS } from 'pages/ordemserv/Types';
import TabelaInsNormativasAlteradas from './TabelaInsNormativasAlteradas';
import PageLoading from 'components/pageloading/PageLoading';
import { confirmarInstrucoesAlteradasOrdem, revogarOrdemPorAltInsNorm } from 'services/ducks/OrdemServ.ducks';
import { connect } from 'react-redux';

class InsNormAlteradasComponent extends Component {

  state = {
    loading: false
  }

  renderHeader = () => {
    if (this.props.dadosAlteracoes) {
      let {titulo, numero, estado, nomeEstado, tipoValidade, dataValidade, dataVigenciaTemporaria} = this.props.dadosAlteracoes.dadosBasicos;
      let validade = tipoValidade === "Determinada" ? dataValidade : tipoValidade;
      let corEstado = MATRIZ_COR_ESTADOS[estado];

      return (
        <Descriptions title="Dados da Ordem" bordered size="small">
          <Descriptions.Item label="Número da O.S."><span style={{fontWeight: "bold"}}>{numero}</span></Descriptions.Item>
          <Descriptions.Item label="Validade" span={2}>{validade}</Descriptions.Item>
          <Descriptions.Item label="Título" span={3}>{titulo}</Descriptions.Item>
          <Descriptions.Item label="Estado" span={3}><span style={{color: corEstado}}>{nomeEstado}</span></Descriptions.Item>
          <Descriptions.Item label="Data Vigência Temporária" span={3}>{dataVigenciaTemporaria}</Descriptions.Item>
        </Descriptions>
      )
    }
  }

  renderTable = () => {
    return (
      <div>
        <Descriptions title="Instruções Alteradas" bordered size="small" />
        <TabelaInsNormativasAlteradas dadosTabela={this.props.dadosAlteracoes.instrucoesNorm} />
      </div>
    )
  }

  openModalConfirmarAlteracoes = () => {
    Modal.confirm({
      title: "Confirmar Alterações nos Textos das IN's",
      content: <span>Ao confirmar as alterações nos textos das IN's, todos os <strong>Designantes</strong> e <strong>Designados</strong> serão notificados solicitando assinatura da Ordem novamente.<br /><br />Deseja confirmar as alterações nesta Ordem?</span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'danger',
      width: 600,
      centered: true,
      onOk: this.onConfirmarAlteracoes
    })
  }

  openModalRevogarOrdem = () => {
    Modal.confirm({
      title: "Confirmar Revogação da Ordem",
      content: <span>
                Ao confirmar a revogação da ordem todos os <strong>Designantes</strong> e <strong>Designados</strong> serão notificados da revogação.<br /><br />
                Deseja revogar a ordem e ignorar as alterações de texto das IN's?
              </span>,
      okText: "Sim",
      cancelText: "Não",
      okType: 'danger',
      width: 600,
      centered: true,
      onOk: this.onRevogarOrdem
    })
  }

  onConfirmarAlteracoes = () => {
    this.setState({loading: true}, () => {
      this.props.confirmarInstrucoesAlteradasOrdem(this.props.idOrdem)
        .then( () => {
          message.success("Alteração nas Instruções Normativas confirmada com sucesso!");
          this.setState({loading: false}, () => {
            this.props.closeModal();
            this.props.atualizarPesquisa();          
          })
        })
        .catch(error => {
          message.error(error);
          this.setState({loading: false})
        })
    })
  }

  onRevogarOrdem = () => {
    this.setState({loading: true}, () => {
      revogarOrdemPorAltInsNorm(this.props.idOrdem)
        .then( () => {
          message.success("Ordem Revogada por Alteração nas Instruções Normativas!");
          this.setState({loading: false}, () => {
            this.props.closeModal();
            this.props.atualizarPesquisa();          
          })
        })
        .catch(error => {
          message.error(error);
          this.setState({loading: false})
        })
    })
  }

  render() {

    if (this.state.loading) {
      return (
        <div>
          <PageLoading />
        </div>
      )
    }

    return (
      <div>
        <StyledCard style={{marginBottom: 10}}>
          {this.renderHeader()}
        </StyledCard>

        <StyledCard style={{minHeight: 495, marginBottom: 10}}>
          {this.renderTable()}
        </StyledCard>

        <StyledCard style={{marginBottom: 10}} bodyStyle={{padding: 10}}>
          <div style={{textAlign: 'center'}}>
            <Button 
              icon={<CheckCircleOutlined />} 
              type="primary" 
              size="large" 
              style={{marginRight: 25}}
              onClick={this.openModalConfirmarAlteracoes}
            >
              Confirmar Alterações
            </Button>

            <Button 
              icon={<ExclamationCircleOutlined />} 
              type="danger" 
              size="large"
              onClick={this.openModalRevogarOrdem}
            >
                Revogar Ordem
            </Button>
          </div>
        </StyledCard>
      </div>
    );
  }
}

export default connect(null, { 
  confirmarInstrucoesAlteradasOrdem
})(InsNormAlteradasComponent);