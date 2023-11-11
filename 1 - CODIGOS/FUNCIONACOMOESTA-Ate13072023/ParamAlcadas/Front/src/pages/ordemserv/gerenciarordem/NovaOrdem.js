import React, { Component } from "react";
import OrdemForm from "./OrdemForm";
import { connect } from "react-redux";
import {
  novaOrdemServico,
  fetchColaborador
} from "services/ducks/OrdemServ.ducks";
import PageLoading from "components/pageloading/PageLoading";
import _ from "lodash";
import history from "@/history.js";
import DrawerNotification from "components/drawernotification";

class NovaOrdem extends Component {
  state = {
    loading: true,
    visible: false
  };

  componentDidMount() {
    this.props.novaOrdemServico(this.onClearData);
  }

  onClearData = () => {
    this.setState({ loading: false }, () => {
      this.showDrawer();

      if (
        _.isEmpty(this.props.colaboradores) &&
        this.props.authState.isLoggedIn
      ) {
        let matriculaColaborador = this.props.authState.sessionData.chave;

        this.props.fetchColaborador(matriculaColaborador, {
          successCallback: () => {},
          errorCallback: () => {}
        });
      }
    });
  };

  onAfterSave = idOrdem => {
    history.push(`/ordemserv/editar-ordem/${idOrdem}`);
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onDrawerClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    } else {
      return (
        <React.Fragment>
          <OrdemForm onAfterSave={this.onAfterSave} />
          <DrawerNotification
            title={"Atenção"}
            visible={this.state.visible}
            onDrawerClose={this.onDrawerClose}
            footerDefaultButtonText={"Ok, entendi."}
            maskClosable={false}
            height={310}
          >
            <div>
              <p>
                Favor atentar a <strong>IN-291</strong> item <strong>4.1.4</strong>:
              </p>

              <div>
                É admitida a emissão de OS de uma Unidade para outra <strong>apenas</strong> nas seguintes situações:
                <ul>
                  <li>4.1.4.1. nos casos em que o designado estiver lotado em Unidade subordinada à designante;</li>
                  <li>4.1.4.2. nos casos envolvendo designação à Diretoria Operações (DIOPE) e às Plataformas de Suporte Operacional (PSO)
                  pelas Unidades por ela atendidas.</li>
                </ul>
              </div>
            </div>
          </DrawerNotification>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    authState: { ...state.app.authState },
    colaboradores: state.ordemserv.ordemEdicao.colaboradores
  };
};

export default connect(mapStateToProps, {
  novaOrdemServico,
  fetchColaborador
})(NovaOrdem);
