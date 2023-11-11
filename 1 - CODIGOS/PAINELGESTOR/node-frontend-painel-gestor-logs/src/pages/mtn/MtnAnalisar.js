import React, { Component } from 'react';
//Redux Dependencies
import { connect } from 'react-redux';
import {
  fetchMtn,
  fetchDadosEnvolvidos,
  fetchDadosEnvolvido,
  criarLock,
  avocarLock,
  liberarLock,
  finalizarMtnSemEnvolvido,
  downloadAnexo
} from 'services/ducks/Mtn.ducks';

import { Alert, Typography, Row, Col } from 'antd';
import ListaAnexos from '../../components/listaAnexos/ListaAnexos';
import PageLoading from 'components/pageloading/PageLoading';
// import Error from "components/erros/Erro";
import { message } from 'antd';
/* Custom Components*/

import MtnDadosBasicos from 'components/mtn/MtnDadosBasicos';
import MtnEnvolvidos from 'components/mtn/MtnEnvolvidos';
import Erro from 'components/erros/Erro';

const { Text } = Typography;
/** STYLED COMPONENT */

class MtnAnalisar extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    loading: true,
    idMtn: this.props.match.params.idMtn,
    idEnvolvido: this.props.match.params.idEnvolvido
      ? this.props.match.params.idEnvolvido
      : null,
    error: null,
  };

  componentDidMount() {
    this.fetchMtn();
  }

  fetchMtn = () => {
    this.setState({ loading: true }, () => {
      this.props.fetchMtn({
        idMtn: this.state.idMtn,
        responseHandler: {
          successCallback: () => this.onSuccessFetchMtn(),
          errorCallback: () => this.setState({ loading: false }),
        },
      });
    });
  };

  onSuccessFetchMtn = () => {
    this.props.fetchDadosEnvolvidos({
      idMtn: this.state.idMtn,
      responseHandler: {
        successCallback: () => this.setState({ loading: false }),
        errorCallback: () =>
          this.setState({
            loading: false,
            error: 'Erro ao recuperar dados básicos',
          }),
      },
    });
  };

  fetchDadosEnvolvidos = () => {
    this.setState({ loading: true }, () => {
      this.props.fetchDadosEnvolvidos({
        idMtn: this.state.idMtn,
        responseHandler: {
          successCallback: () => this.setState({ loading: false }),
          errorCallback: () => console.log('Erro ao recuperar Envolvidos'),
        },
      });
    });
  };

  criarLock = () => {
    this.setState({ loading: true }, () => {
      this.props.criarLock({
        idMtn: this.state.idMtn,
        responseHandler: {
          successCallback: () => {
            this.fetchMtn();
          },
          errorCallback: () => {
            message.error('Não foi possível avocar o protocolo');
          },
        },
      });
    });
  };

  avocarLock = () => {
    this.setState({ loading: true }, async () => {
      this.props.avocarLock({
        idMtn: this.state.idMtn,
        responseHandler: {
          successCallback: () => {
            this.fetchMtn();
          },
          errorCallback: () =>
            message.error('Não foi possível avocar o protocolo'),
        },
      });
    });
  };

  liberarLock = () => {
    this.props.liberarLock({
      idMtn: this.state.idMtn,
      responseHandler: {
        successCallback: () => {
          this.fetchMtn();
        },
        errorCallback: () =>
          message.error('Não foi possível avocar o protocolo'),
      },
    });
  };

  finalizarMtn = (idMtn, justificativa) => {
    return finalizarMtnSemEnvolvido(idMtn, justificativa)
      .then(() => {
        message.success('Mtn Finalizado com sucesso');
        this.fetchMtn();
      })
      .catch((error) => {
        if (typeof error === 'string') {
          message.error(error);
        } else {
          message.error('Erro ao finalizar a solicitacao');
        }
      });
  };

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }

    if (this.state.error) {
      message.error(this.state.error);
      return (
        <Erro
          erro={{
            codigo: 500,
            msg: 'Ocorreu um erro de sistema. Caso o mesmo persista, favor contactar o administrador do sistema',
          }}
        />
      );
    }

    return (
      <div>
        <div style={{ marginBottom: 20, marginLeft: 10 }}>
          <Text strong>#confidencial</Text>
        </div>
        <MtnDadosBasicos
          dadosBasicos={this.props.dadosBasicos}
          matriculaLogado={this.props.usuarioLogado.matricula}
          criarLock={this.criarLock}
          avocarLock={this.avocarLock}
          liberarLock={this.liberarLock}
          admin={true}
          fetchMtn={this.fetchMtn}
          readOnly={
            this.props.dadosBasicos.readOnly === undefined
              ? false
              : this.props.dadosBasicos.readOnly
          }
        />

        {this.props.dadosBasicos.idStatus === 3 &&
        this.props.dadosBasicos.fechadoSemEnvolvido ? (
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Alert
                message="Ocorrência fechada sem envolvido"
                description={
                  <>
                    <p>
                      Justificativa:
                      {
                        this.props.dadosBasicos.fechadoSemEnvolvido
                          .justificativa
                      }
                    </p>
                    <p>
                      {`
                  Fechado por
                  ${this.props.dadosBasicos.fechadoSemEnvolvido.matricula_responsavel}
                  - 
                  ${this.props.dadosBasicos.fechadoSemEnvolvido.nome_responsavel}
                  em ${this.props.dadosBasicos.fechadoSemEnvolvido.created_at}
                  `}
                    </p>
                  </>
                }
                type="warning"
              />
            </Col>
            {this.props.dadosBasicos.fechadoSemEnvolvido.anexos && (
              <Col span={6}>
                <ListaAnexos
                  downloadAnexo={this.props.downloadAnexo}
                  anexos={this.props.dadosBasicos.fechadoSemEnvolvido.anexos}
                />
              </Col>
            )}
          </Row>
        ) : (
          <MtnEnvolvidos
            medidas={this.props.medidas}
            statusMtn={this.props.dadosBasicos.idStatus}
            fetchDadosEnvolvidos={() => this.fetchDadosEnvolvidos()}
            idMtn={this.state.idMtn}
            envolvidos={this.props.envolvidos}
            envolvidoSelecionado={this.state.idEnvolvido}
            readOnly={
              this.props.dadosBasicos.readOnly === undefined
                ? false
                : this.props.dadosBasicos.readOnly
            }
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ mtn, app }) => ({
  dadosBasicos: mtn.admOcorrencias.mtnAnalise.dadosBasicos,
  medidas: mtn.admOcorrencias.mtnAnalise.medidas,
  envolvidos: mtn.admOcorrencias.mtnAnalise.envolvidos,
  usuarioLogado: app.authState.sessionData,
});

export default connect(mapStateToProps, {
  fetchMtn,
  fetchDadosEnvolvidos,
  fetchDadosEnvolvido,
  criarLock,
  avocarLock,
  liberarLock,
  downloadAnexo,
})(MtnAnalisar);
