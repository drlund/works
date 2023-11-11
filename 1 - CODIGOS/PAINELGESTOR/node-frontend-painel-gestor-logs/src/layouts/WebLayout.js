import React, { Component } from 'react'
import { Router } from 'react-router-dom';
import history from '../history';
import NavBar from 'components/navbar/NavBar';
import SideBar from 'components/sidebar/SideBar';
import { Layout } from 'antd';
import FramePage from 'components/framepage/FramePage';
import Footer from 'components/footer/Footer';
import PiwikReactRouter from 'piwik-react-router';
import {  getEnvironment } from 'utils/Commons';
import { connect } from 'react-redux';
import _ from 'lodash';
import "@/App.css";

class WebLayout extends Component {

  constructor(props) {
    super(props);

    this.piwik = PiwikReactRouter({
      siteId: 1,
      url: 'https://super.intranet.bb.com.br/analytics',
      updateDocumentTitle: false
    });
  }
  
  //Ao atualizar os dados do usuario preenche novamente o objecto do Piwik.
  componentDidUpdate() {
    this.fillPiwikData();
  }

  /**
   * Preenche os dados do usuario no objecto Piwik.
   */
  fillPiwikData = () => {
    if ( this.props.dadosUsuario && !_.isEmpty(this.props.dadosUsuario)) {
      let { matricula, prefixo, dependencia, nome_usuario, nome_guerra, 
        cod_funcao, nome_funcao, pref_regional, nome_regional, 
        pref_super, nome_super, pref_diretoria, uf} = this.props.dadosUsuario;

      this.piwik.push(["setDocumentTitle", document.domain + "/" + document.title]);
      this.piwik.push(['setCustomVariable', 1, 'Prefixo', prefixo, 'visit']);
      this.piwik.push(['setCustomVariable', 2, 'Dependencia', dependencia, 'visit']);
      this.piwik.push(['setCustomVariable', 3, 'Matricula', matricula, 'visit']);
      this.piwik.push(['setCustomVariable', 4, 'Nome', nome_usuario, 'visit']);
      this.piwik.push(['setCustomVariable', 5, 'Nome Guerra', nome_guerra, 'visit']);
      this.piwik.push(['setCustomVariable', 6, 'Cod. Comissao', cod_funcao, 'visit']);
      this.piwik.push(['setCustomVariable', 7, 'Comissao', nome_funcao, 'visit']);
      this.piwik.push(['setCustomVariable', 8, 'Pref.Reg.', pref_regional, 'visit']);
      this.piwik.push(['setCustomVariable', 9, 'Regional', nome_regional, 'visit']);
      this.piwik.push(['setCustomVariable', 10, 'Pref. Super', pref_super, 'visit']);
      this.piwik.push(['setCustomVariable', 11, 'Super', nome_super, 'visit']);
      this.piwik.push(['setCustomVariable', 12, 'Diretoria', pref_diretoria, 'visit']);
      this.piwik.push(['setCustomVariable', 13, 'UF', uf, 'visit']);
    }
  }

  /**
   * Configura o id do site no matomo e solicita um track da rota.
   * Metodo repassado para o componente FramePage.
   */
  configureTrackerId = (trackerId) => {    
    const environment = getEnvironment();

    if (window.Piwik && environment !== "development") {
      let trackers = window.Piwik.getAsyncTrackers();

      if (trackers.length) {
        let trck = trackers[0];

        let currentUrl = trck.getCurrentUrl()
        let siteId = trck.getSiteId();

        if (currentUrl !== document.location.href || trackerId !== siteId) {
          trck.setSiteId(trackerId);
          trck.setCustomUrl(document.location.href)
          trck.trackPageView();
        }
      }
    }
  }

  render() {
    let superFunci = "Super ADM";
    if( this.props.dadosUsuario && !_.isEmpty(this.props.dadosUsuario) &&
     (  this.props.dadosUsuario.pref_super !== "0000" && this.props.dadosUsuario.pref_super !== 0 && this.props.dadosUsuario.pref_super !== "9009") ){      
      superFunci = this.props.dadosUsuario.nome_super;
    }
    
    superFunci = superFunci.replace("VAREJO",'').substr(0, 16);
    let marginLeftContent = this.props.sideBarCollapsed ? 80 : 256;
    let transitionTime = this.props.sideBarCollapsed ? 'all .3s' : 'all .08s';
    
    if (this.props.isFullScreenMode) {
      marginLeftContent = 0
    }

    return (
      <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        <Layout className="fade-in">
          <Layout>
            <SideBar title={superFunci} />
          </Layout>
          <Layout style={{ marginLeft: marginLeftContent, minHeight: '100vh', transition: transitionTime }}>
            <NavBar />
            <FramePage configureTrackerId={this.configureTrackerId}/>
            <Footer />
          </Layout>
        </Layout>
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
    dadosUsuario: state.app.authState.sessionData,
    sideBarCollapsed: state.app.sideBarCollapsed,
    isFullScreenMode: state.app.fullScreenMode
  }
}


export default connect(mapStateToProps)(WebLayout);