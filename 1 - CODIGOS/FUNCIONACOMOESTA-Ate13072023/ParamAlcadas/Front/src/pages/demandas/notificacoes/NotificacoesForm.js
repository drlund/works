import React, {Component} from 'react';
import { Tabs, Row, Col } from 'antd';

import { connect } from 'react-redux';
import { updateFormData } from 'services/actions/demandas';
import _ from 'lodash';

import Notificacao from './Notificacao';
import AlertList from 'components/alertlist/AlertList';
import StyledCard from 'components/styledcard/StyledCard';

const { TabPane } = Tabs;

class NotificacoesForm extends Component {

  static propName = 'notificacoes';
  static configNotificacoes = {

    convite: {
      display: "Convite",
      defaultTitle: "Convite para responder a demanda - {tituloDemanda}",
      defaultContent: "Você foi convidado a responder à demanda {tituloDemanda}",
      description:  () => {return ( <span>
                        <p>Será enviado para os público alvo da demanda convidando-os para respondê-la.</p>
                        <p><strong> Poderá ser enviado somente uma vez.</strong></p>
                      </span>)},      
    },
    
    lembrete: {
      display: "Lembrete",
      defaultTitle: "Lembrete para responder a demanda - {tituloDemanda}",
      defaultContent: "Você foi convidado a responder à demanda {tituloDemanda}",
      description: () => {return (<span>
                        <p>Mensagem para lembrar um participante de responder a demanda. Seu envio segue as seguintes regras:</p>
                        <ul>
                          <li>Só poderá ser enviado após o envio do convite</li>
                          <li>Pode ser enviado múltiplas vezes</li>
                          <li>Não pode ser enviado para aqueles que já responderam à demanda</li>
                          <li>Pode ser enviado a todos os não respondentes ou àqueles selecionados</li>
                        </ul>
                      </span>)},      
    },
    agradecimento: {
      display: "Agradecimento",
      defaultTitle: "Muito obrigado",
      defaultContent: "Obrigado por responder à demanda {tituloDemanda}",
      description:  () => {return ( <span>
                        <p>Será enviado para após a resposta.</p>                        
                      </span>)},      
    },

  };

  onTextChange = (valorDigitado,tipoNotificacao,campo) => {
    this.props.updateFormData(NotificacoesForm.propName, { [tipoNotificacao]: {...this.props.notificacoes[tipoNotificacao], [campo]: valorDigitado} });
  }

  renderNotificacao = (configData, identificador) => {
    if (_.isEmpty(configData)) {
      return(
        <TabPane tab={NotificacoesForm.configNotificacoes[identificador].display} key={identificador}>
          <Notificacao 
            tipoNotificacao={identificador}
            display={NotificacoesForm.configNotificacoes[identificador].display} 
            defaultTitle={NotificacoesForm.configNotificacoes[identificador].defaultTitle}
            defaultContent ={NotificacoesForm.configNotificacoes[identificador].defaultContent}

            tituloDemanda={this.props.tituloDemanda}
            descricaoDemanda={this.props.descricaoDemanda}
            description={NotificacoesForm.configNotificacoes[identificador].description} 
            onTextChange = {this.onTextChange} 
          />
        </TabPane>
      )
    } else {      
      return(
        <TabPane tab={NotificacoesForm.configNotificacoes[identificador].display} key={identificador}>
          <Notificacao 
            tipoNotificacao={identificador}
            display={NotificacoesForm.configNotificacoes[identificador].display} 
            defaultTitle={this.props.notificacoes[identificador].titulo}
            defaultContent ={this.props.notificacoes[identificador].conteudo}
            description={NotificacoesForm.configNotificacoes[identificador].description} 
            onTextChange = {this.onTextChange} 
          />
        </TabPane>
      )
    }
  }

  constructor(props) {
    super(props);

    let initialState = {};

    if (_.isEmpty(props.notificacoes.convite)) {
      Object.keys(NotificacoesForm.configNotificacoes).map( (key) => {
        initialState[key] = {
          titulo: NotificacoesForm.configNotificacoes[key].defaultTitle,
          conteudo: NotificacoesForm.configNotificacoes[key].defaultContent
        }

        return key;
      })
    } else {
      Object.keys(NotificacoesForm.configNotificacoes).map( (key) => {
        initialState[key] = {
          titulo: props.notificacoes[key].titulo,
          conteudo: props.notificacoes[key].conteudo
        }

        return key;
      })
    }

    props.updateFormData(NotificacoesForm.propName, initialState);

  }

  render() {

    
    return (
      <StyledCard title="Gerenciar notificações">
          <Tabs tabPosition="left">
          
        {
          Object.keys(NotificacoesForm.configNotificacoes).map( (key) => {
            let configData = !_.isEmpty(this.props.notificacoes[key]) ? this.props.notificacoes[key] : {};
            return this.renderNotificacao(configData, key);            
          })
        }
    
        </Tabs>

        <Row style={{marginTop: '15px'}}>
          <Col span={24}>
            <AlertList title="Erros Encontrados" messagesList={this.props.errorsList}/>
          </Col>
        </Row>

      </StyledCard>
    )
  }



}

const mapStateToProps = state => {

  return{
    notificacoes: state.demandas.demanda_atual.notificacoes ? state.demandas.demanda_atual.notificacoes : { convite: {}, lembrete: {}, agradecimento: {} },    
    errorsList: state.demandas.demanda_erros.notificacoes
  }

}


export default connect(mapStateToProps,{updateFormData})(NotificacoesForm);