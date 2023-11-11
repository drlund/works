import React, {Component} from 'react';
import {Tabs, Row, Col, Button,Progress, Skeleton, Popconfirm, message, Divider } from 'antd';
import HistoricoNotificacoes from './notificacoes/HistoricoNotificacoes';
import AdmPublicoAlvo from './publicoalvo/AdmPublicoAlvo';
import {StatusDemandas} from './Types';
import EstatisticaDemanda from './notificacoes/EstatisticasDemanda';
import PageLoading from 'components/pageloading/PageLoading';

import { 
  fetchEstatisticasDemanda, 
  fetchHistoricoNotificacoes, 
  fetchStatusNotificacoes, 
  fetchDemanda,
  enviarConvites, 
  enviarNotificacoes,
  fetchDownloadRespostas
} from 'services/actions/demandas';

import { connect } from 'react-redux';

const { TabPane } = Tabs;

const constantes = {
  tabs: {
    publicoAlvo: "publicoAlvo",
    estatisticas: "estatisticas"
  },
  pollingTime: 1500
}

const ButtonGroup = Button.Group;

class AcompanharDemanda extends Component{
  state = {         
    loading: {
      estatisticasDemanda: true,
      historicoNotificacoes: true,
      statusNotificacoes: true,
      publicoAlvo: true,
      downloadCSV: false
    },
    activeTab: constantes.tabs.estatisticas,
    idDemanda: this.props.match.params.id,
  };

  onFetchedDemanda = () => {  
    this.setState({loading: false});
  }

  componentDidMount = () => {
    this.props.fetchDemanda({
      idDemanda: this.state.idDemanda, 
      responseHandler: {
        successCallback: () => {
          this.loadTabData(this.state.activeTab, true);
        },
        errorCallback: () => message.error('Falha ao obter os dados da demanda.')
      },
      apenasColaborador: true
    });
  } 

  enviarNotificacoes = () => {
    this.pollLembretes();
    this.props.enviarNotificacoes(
      {idDemanda: this.state.idDemanda,
      responseHandler: {
        successCallback: () => this.updateHistoricoNotificacoes(),
        errorCallback: () => console.log("Ocorreu um erro no envio das notificacoes")
      }}
    );
  }

  enviarConvites = () => {
    this.pollConvites();
    this.props.enviarConvites(
      {idDemanda: this.state.idDemanda,
      responseHandler: {
        successCallback: () => this.updateHistoricoNotificacoes(),
        errorCallback: () => console.log("Ocorreu um erro no envio das notificacoes")
      }}
    );
  }

  loadPublicoAlvo = () => {    
    this.setState({loading: {...this.state.loading, publicoAlvo:false }});
  }

  updateEstatisticas = () => {    
    this.setState({            
      loading: {...this.state.loading, estatisticasDemanda:true}},
      //Callback do setstate
      () => {                
        this.props.fetchEstatisticasDemanda(
          {idDemanda: this.state.idDemanda,
          responseHandler: {
            successCallback: () => this.setState({loading: {...this.state.loading, estatisticasDemanda:false }}),
            errorCallback: () => console.log("Ocorreu um erro")
          }}
        );
    });
  }

  updateStatusNotificacoes = () => {
    
    this.setState({            
      loading: {...this.state.loading, statusNotificacoes:true}},
      //Callback do setstate
      () => {                
        this.props.fetchStatusNotificacoes(
          {idDemanda: this.state.idDemanda,
          responseHandler: {
            successCallback: () => this.setState({loading: {...this.state.loading, statusNotificacoes:false }}),
            errorCallback: () => console.log("Ocorreu um erro")
          }}
        );
    });
  }

  updateHistoricoNotificacoes = async () => {
    
    await this.setState({loading: {...this.state.loading, historicoNotificacoes:true}},
      //Callback do setstate
      () => {   
        this.props.fetchHistoricoNotificacoes(
          {idDemanda: this.state.idDemanda,
          responseHandler: {
            successCallback: () => this.setState({loading: {...this.state.loading, historicoNotificacoes:false }}),
            errorCallback: () => console.log("Ocorreu um erro")
          }}
        );          
    });
  }


 //realiza o polling no servidor remoto de autenticacao
  pollLembretes = () => {
    let intervalInstance = setInterval(async () => {
      
      await this.props.fetchStatusNotificacoes(
        {idDemanda: this.state.idDemanda,
        responseHandler: {
          successCallback: () => this.checkEnviandoLembretes(intervalInstance),
          errorCallback: () => console.log("Ocorreu um erro")
        }}
      );
    }, constantes.pollingTime);
  }

  pollConvites = () => {
    let intervalInstance = setInterval(async () => {
      
      await this.props.fetchStatusNotificacoes(
        {idDemanda: this.state.idDemanda,
        responseHandler: {
          successCallback: () => this.checkEnviandoConvites(intervalInstance),
          errorCallback: () => console.log("Ocorreu um erro")
        }}
      );
    }, constantes.pollingTime);
  }

  //cancela a rotina de polling
  checkEnviandoLembretes = (intervalInstance) => {
    if (!this.props.lembretes.enviando) {
      clearInterval(intervalInstance)
    }
  }

  checkEnviandoConvites = (intervalInstance) => {
    if (!this.props.convites.enviando) {
      clearInterval(intervalInstance)
    }
  }

  loadTabData = (aba, initialLoad = false) => {
    this.setState({activeTab: aba}, 
      () => { 

        switch (aba) {
          //Aba do publico alvo
          case constantes.tabs.publicoAlvo:
             
              this.setState({            
                loading: {...this.state.loading, publicoAlvo:true}}, () => {
                  this.loadPublicoAlvo();                  
                })
            break;

          case constantes.tabs.estatisticas:
            if (initialLoad) {
              this.setState({loading: {   
                estatisticasDemanda: true,
                historicoNotificacoes: true,
                statusNotificacoes: true}}, () => {
                  this.updateEstatisticas();
                  this.updateStatusNotificacoes();
                  this.updateHistoricoNotificacoes();
                })  
            } else {
              this.setState({loading: {                   
                historicoNotificacoes: true,
                statusNotificacoes: true}}, () => {
                  this.updateStatusNotificacoes();
                  this.updateHistoricoNotificacoes();
                  this.setState({loading: {...this.state.loading, estatisticasDemanda:false }});
                })  
            }
            break; 

          default:
            break;
        }
      });    
  }

  renderButtonConvites = () => {
    if(this.props.statusDemanda !== StatusDemandas.PUBLICADA){
      return "";
    }

    let percentualEnvio = this.props.convites.total === 0 ? 0 :this.props.convites.enviados*100/this.props.convites.total;
    if(/*this.props.convites.convitesEnviados ||*/ this.props.convites.enviando){      
        return(
          <span>
            <ButtonGroup>              
              <Button type="primary" onClick={this.enviarNotificacoes} style={{marginRight: 30}}  disabled> {this.props.convites.enviando ? "Convites sendo enviados" : "Convites já enviados"}</Button>
            </ButtonGroup> 
            {
              this.props.convites.enviando ?
                <Progress type="circle" percent={percentualEnvio} format={ (percent, successPercent) => percent.toFixed(2) } /> :
                <Progress type="circle" percent={100} /> 
            }     
          </span>
        );      
    }else{
      return(
        <span>
          <ButtonGroup>
            <Popconfirm 
              title="Confirma a o envio dos convites?" 
              onConfirm={() => this.enviarConvites()}
            >
              <Button type="primary"  style={{marginRight: 30}} > Enviar Convites</Button>
            </Popconfirm>
          </ButtonGroup>  
              
          <Progress type="circle" percent={percentualEnvio} format={ (percent, successPercent) => percent.toFixed(2) } />
        </span>
      );
    }
  }

  renderButtonLembretes = () => {
   
    if(!this.props.convites.convitesEnviados || this.props.statusDemanda !== StatusDemandas.PUBLICADA)  { 
      return "";
    }

    let disabled = this.props.lembretes.jaEnviados >= this.props.lembretes.maxEnvio || this.props.lembretes.enviando;
    let percentualEnvio = this.props.lembretes.total === 0 ? 0 : this.props.lembretes.enviados*100/this.props.lembretes.total;

    if(disabled){
      return(
        <span>
          <ButtonGroup>
              <Button type="primary" style={{marginRight: 30}} disabled> {this.props.lembretes.enviando ? "Enviando lembretes" : "Lembretes já enviados"}  
                <span style={{marginLeft: 5}}>{this.props.lembretes.jaEnviados}/{this.props.lembretes.maxEnvio}</span>
              </Button>
         
          </ButtonGroup> 
          {this.props.lembretes.enviando ? 
            <Progress type="circle" percent={percentualEnvio} format={ (percent, successPercent) => percent.toFixed(2) } />
          : <Progress type="circle" percent={100} /> }           
        </span>
        );
    }else{
      return(
       <span>
         <ButtonGroup>
           <Popconfirm 
             title="Confirma a o envio dos lembretes?" 
             onConfirm={() =>this.enviarNotificacoes()}             
           >
             <Button type="primary"style={{marginRight: 30}}> Enviar lembretes  
               <span style={{marginLeft: 5}}>{`${this.props.lembretes.jaEnviados}`}/{this.props.lembretes.maxEnvio}</span>
             </Button>
           </Popconfirm>
         </ButtonGroup>           
         <Progress type="circle" percent={percentualEnvio} format={ (percent, successPercent) => percent.toFixed(2) } />

       </span>
       );
    }
      
  }

  render() {    
     return (   
        <div>
          <Tabs type="card" activeKey={this.state.activeTab}  onChange={this.loadTabData} >
            <TabPane tab="Estatísticas" key={constantes.tabs.estatisticas}>            
              <Row gutter={16}>
                <Col span={24}>
                  <EstatisticaDemanda 
                    {...this.props.estatisticasDemanda} 
                    idDemanda={this.props.match.params.id}
                    statusDemanda={this.props.statusDemanda} 
                    reload={this.updateEstatisticas}
                    tituloDemanda={this.props.tituloDemanda}
                    loading={this.state.loading.estatisticasDemanda}
                    respostaUnica={this.props.publicoAlvo && this.props.publicoAlvo.respostaUnica !== undefined ? this.props.publicoAlvo.respostaUnica : true }
                    tipoPublico={this.props.publicoAlvo ? this.props.publicoAlvo.tipoPublico : null}
                  />
                </Col> 
              </Row>

              <Row style={{ marginTop: 10 }}>
                  <Skeleton loading={this.state.loading.statusNotificacoes} active title={false} paragraph={{ rows: 6 }}>
                    {
                      this.props.statusDemanda === StatusDemandas.PUBLICADA &&
                      <Divider orientation="left">Envio de Notificações</Divider>
                    }
                    
                    <Col  offset={6} span={6}>                      
                      { this.props.convites && this.renderButtonConvites()}
                    </Col>                    
                    <Col span={6}>
                      { this.props.lembretes && this.renderButtonLembretes() }                     
                    </Col>

                  </Skeleton>
              </Row>
              <Row style={{ marginTop: 50, marginBottom: 50 }}>
                <Skeleton loading={this.state.loading.historicoNotificacoes} active title={false} paragraph={{ rows: 6 }}>
                    <Col   span={24}>
                        {this.props.historicoNotificacoes && <HistoricoNotificacoes historicoNotificacoes={this.props.historicoNotificacoes}/> }
                    </Col>
                  </Skeleton>
              </Row>        
          
            </TabPane>
            <TabPane style={{minHeight: 300}} tab="Público Alvo" disabled={this.state.loading.estatisticasDemanda} key={constantes.tabs.publicoAlvo}>
                {     
                  this.state.loading.publicoAlvo ?
                    <PageLoading  /> :
                    <AdmPublicoAlvo 
                      idDemanda={this.props.idDemanda} 
                      reloadEstatisticas={this.updateEstatisticas}
                      publicoAlvo={this.props.publicoAlvo}
                    />
                }
            </TabPane>
          </Tabs>
        </div>
    )
  }

}

const mapStateToProps = state => {
  return {  estatisticasDemanda: state.demandas.estatisticasDemanda,
            convites: state.demandas.statusNotificacoes.convites,
            lembretes:  state.demandas.statusNotificacoes.lembretes,
            historicoNotificacoes: state.demandas.historicoNotificacoes,
            publicoAlvo: state.demandas.demanda_atual.publicoAlvo,
            tituloDemanda: state.demandas.demanda_atual.geral ? state.demandas.demanda_atual.geral.titulo : '',
            statusDemanda: state.demandas.demanda_atual.geral ? state.demandas.demanda_atual.geral.status : '',
            idDemanda: state.demandas.demanda_atual.id
          }
}

export default connect( mapStateToProps, {
  fetchHistoricoNotificacoes, 
  fetchEstatisticasDemanda, 
  fetchStatusNotificacoes, 
  fetchDemanda,
  enviarNotificacoes, 
  enviarConvites, 
  fetchDownloadRespostas
})(AcompanharDemanda);

