import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Tabs, Modal, message } from 'antd';

import PageLoading from 'components/pageloading/PageLoading';
import Validacao from 'pages/designacao/Solicitacao/Validacao';
import {
  gravarSolicitacao,
  getTiposMovimentacao,
  setTipo,
  resetDesignacao,
  getNegativas,
  setCadeia,
} from 'services/ducks/Designacao.ducks';

import { arrayToString } from 'utils/ArrayUtils';

import {
  getPrefixosTeste,
} from '../apiCalls/fetch';

const { TabPane } = Tabs;

class Solicitacao extends PureComponent {
  constructor(props) {
    super(props);

    this._isMounted = true;

    this.state = {
      tipos: [],
      modalVisivel: false,
      validKey: moment().valueOf(),
      protocolo: '',
      recharge: false,
      prefixosSuperTeste: []
    };
  }

  componentDidMount() {
    this.fazerConsultas();
  }

  componentDidUpdate() {
    const { recharge } = this.state;
    if (recharge && this._isMounted) {
      this.fazerConsultas();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fazerConsultas = () => {
    const { protocolo } = this.state;
    const {
      getTiposMovimentacao: thisGetTiposMovimentacao,
      setCadeia: thisSetCadeia,
      getNegativas: thisGetNegativas
    } = this.props;

    let thisProtocolo;
    if (protocolo) {
      thisProtocolo = protocolo;
    }
    thisGetTiposMovimentacao()
      .then((tipos) => this._isMounted && this.setState({ tipos }, () => true))
      .then(() => this._isMounted && getPrefixosTeste())
      .then((prefixosSuperTeste) => {
        if (this._isMounted) {
          this.setState(
            { prefixosSuperTeste },
            () => this.onInfo(1)
          );
        }
      })
      .then(() => this._isMounted && thisGetNegativas())
      .then(() => this._isMounted && thisProtocolo && thisSetCadeia(thisProtocolo))
      .catch((error) => message.error(error))
      .then(() => this._isMounted && this.setState({ recharge: false }, () => true));
  };

  onInfo = (num = 1) => {
    const { modalVisivel, tipos, prefixosSuperTeste } = this.state;
    const { setTipo: thisSetTipo } = this.props;
    if (this._isMounted && !modalVisivel && !_.isEmpty(tipos)) {
      const numero = parseInt(num, 10);
      const tipo = _.head(tipos.filter((elem) => elem.id === numero));

      thisSetTipo(tipo.id)
        .then(() => {
          this.setState({ modalVisivel: true }, () => {
            Modal.info({
              title: `${tipo.nome}`,
              content: (
                <div>
                  <div style={{ fontSize: '1.3rem' }}>
                    {tipo.titulo}
                  </div>
                  <div style={{ fontSize: '1.2rem', textAlign: 'justify' }}>
                    &quot;
                    {tipo.texto}
                    &quot;
                  </div>
                  {/* remover após período de testes */}
                  <div style={{ fontSize: '1.2rem', textAlign: 'justify' }}>
                    <br />
                    PARA O PERÍODO DE TESTES, APENAS FUNCIONÁRIOS DAS ESTADUAIS
                    {' '}
                    <strong>
                      {arrayToString(prefixosSuperTeste)}
                    </strong>
                    {' '}
                    PODEM SER SELECIONADOS NO SEGUNDO PASSO.
                  </div>
                </div>
              )
            });
          });
        })
        .catch((error) => message.error(error))
        .then(() => this.setState({ validKey: moment().valueOf() }));
    }
  };

  onTabChange = (key) => {
    const { resetDesignacao: thisResetDesignacao } = this.props;
    if (this._isMounted) {
      this.setState({ modalVisivel: false }, () => {
        thisResetDesignacao()
          .then(() => this.onInfo(key))
          .catch((error) => message.error(error))
          .then(() => this.fazerConsultas());
      });
    }
  };

  confirmar = (protocolo = null) => {
    if (this._isMounted) {
      this.setState({ validKey: moment().valueOf() }, () => {
        this.setState({ protocolo });
        if (!protocolo) {
          this.setState({ recharge: true });
        }
      });
    }
  };

  render() {
    const { tipos, validKey, protocolo } = this.state;
    const { funciLogado } = this.props;
    if (funciLogado && !_.isEmpty(tipos)) {
      return (
        <Tabs
          type="card"
          tabBarGutter={20}
          style={{ inkBar: true }}
          onTabClick={this.onTabChange}
        >
          {
            tipos.map((elem) => (
              <TabPane
                tab={elem.nome}
                key={elem.id}
              >
                <Validacao
                  key={validKey}
                  tipo={elem}
                  confirmar={this.confirmar}
                  funciLogado={funciLogado}
                  protocolo={protocolo}
                />
              </TabPane>
            ))
          }
        </Tabs>
      );
    }

    return <PageLoading />;
  }
}

const mapStateToProps = (state) => ({
  funciLogado: state.app.authState.sessionData
});

export default connect(mapStateToProps, {
  gravarSolicitacao, getTiposMovimentacao, setTipo, resetDesignacao, getNegativas, setCadeia
})(Solicitacao);
