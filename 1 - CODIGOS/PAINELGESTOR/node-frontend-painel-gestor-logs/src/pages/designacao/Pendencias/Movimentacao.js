import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Modal,
  message,
  Typography,
  Button
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';
import { connect } from 'react-redux';

import Solicitacao from 'pages/designacao/Pendencias/Solicitacao';
import Historico from 'pages/designacao/Pendencias/Historico';
import Parecer from 'pages/designacao/Pendencias/Parecer';
import Analise from 'pages/designacao/Pendencias/Analise';
import StyledCardPrimary from 'components/styledcard/StyledCard';
import {
  setResponsavel,
  getResponsavel,
} from 'services/ducks/Designacao.ducks';
import QuadroDependencia from 'pages/designacao/Pendencias/QuadroDependencia';

const { confirm } = Modal;
const { Text } = Typography;

class Movimentacao extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      responsavel: '',
      funcionarioLogado: '',
      acesso: '',
      ativo: false,
      parecerKey: moment().valueOf(),
      registro: false,
      modalParecerVisible: false,
    };
  }

  componentDidMount() {
    this.getResponsavel();
  }

  getResponsavel = () => {
    const { getResponsavel: thisGetResponsavel, movimentacao, consulta } = this.props;
    thisGetResponsavel(movimentacao.id)
      .then((responsavel) => {
        if (consulta) {
          this.setState({
            ativo: true,
            acesso: 'partial',
            funcionarioLogado: responsavel.funcionarioLogado,
            registro: responsavel.permissaoRegistro,
            funciOuPrefixoSolicitante: responsavel.funciOuPrefixoSolicitante
          });
        } else {
          this.setState(
            {
              responsavel: responsavel.responsavel,
              funcionarioLogado: responsavel.funcionarioLogado,
              registro: responsavel.permissaoRegistro,
            },
            () => {
              this.respons(movimentacao.id);
            }
          );
        }
      })
      .catch((error) => message.error(error));
  };

  setResponsavell = (id, set = null) => {
    const { funcionarioLogado, responsavel } = this.state;
    if (set) {
      setResponsavel(id)
        .then((resp) => this.setState({ responsavel: resp.responsavel }, () => {
          if (_.isEqual(funcionarioLogado, resp.responsavel)) {
            this.setState({ acesso: 'full' });
          } else {
            this.setState({ acesso: 'partial' });
            message.warning(
              'Você NÂO é o Funcionário responsável pela condução desta solicitação.'
            );
            message.warning(
              'Acesso Restrito a Envio de Documentos e de Parecer Não Conclusivo!'
            );
          }
          this.setState({ ativo: true });
        }))
        .catch((error) => message.error(error));
    } else {
      if (_.isEqual(funcionarioLogado, responsavel)) {
        this.setState({ acesso: 'full' });
      } else {
        this.setState({ acesso: 'partial' });
        message.warning(
          'Você NÂO é o Funcionário responsável pela condução desta solicitação.'
        );
        message.warning(
          'Acesso Restrito a Envio de Documentos e de Parecer Não Conclusivo!'
        );
      }
      this.setState({ ativo: true });
    }
  };

  respons = (id) => {
    const { responsavel, funcionarioLogado } = this.state;
    let titulo;

    const setRResponsavel = (thisId, set = null) => {
      this.setResponsavell(thisId, set);
    };

    if (_.isEmpty(responsavel)) {
      titulo = 'A presente solicitação não possui Funcionário responsável pela sua condução. Deseja reivindicar a responsabilidade desta solicitação?';
    } else {
      if (responsavel === funcionarioLogado) {
        setRResponsavel(id);
        return;
      }
      titulo = `O Funcionário ${responsavel} é o atual responsável pela condução desta solicitação. Deseja reivindicar a responsabilidade desta solicitação?`;
    }

    confirm({
      title: `${titulo}`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setRResponsavel(id, 1);
      },
      onCancel() {
        setRResponsavel(id);
      },
      okText: 'Sim',
      cancelText: 'Não',
    });
  };

  updateSelf = (idHistorico) => {
    const { onClose } = this.props;
    this.setState({ parecerKey: moment().valueOf() });

    if ([17, 20, 21, 22, 23, 24, 25, 26, 27, 28].includes(idHistorico)) {
      onClose();
    }
  };

  fecharParecer = () => {
    this.setState({ modalParecerVisible: false });
  };

  render() {
    const {
      acesso,
      ativo,
      funcionarioLogado,
      funciOuPrefixoSolicitante,
      modalParecerVisible,
      parecerKey,
      registro,
      responsavel,
    } = this.state;
    const {
      consulta,
      movimentacao,
    } = this.props;
    return (
      ativo && (
        <Card bodyStyle={{ maxHeight: '75vh' }}>
          <Row>
            <Col>
              <Solicitacao id={movimentacao.id} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Row>
                <Col>
                  <StyledCardPrimary
                    title={(
                      <Text>
                        Quadro do prefixo de Origem -
                        {' '}
                        {movimentacao.pref_orig}
                      </Text>
                    )}
                    headStyle={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#74B4C4',
                      fontSize: '1.3rem',
                    }}
                    bodyStyle={{ padding: 5 }}
                  >
                    <QuadroDependencia
                      dotacoes={
                        movimentacao.dotacoes
                        && movimentacao.dotacoes.origem
                      }
                      prefixo={movimentacao.pref_orig}
                    />
                  </StyledCardPrimary>
                </Col>
              </Row>
              <Row>
                <Col>
                  <StyledCardPrimary
                    title={(
                      <Text>
                        Quadro do prefixo de Destino -
                        {' '}
                        {movimentacao.pref_dest}
                      </Text>
                    )}
                    headStyle={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      background: '#74B4C4',
                      fontSize: '1.3rem',
                    }}
                    bodyStyle={{ padding: 5 }}
                  >
                    <QuadroDependencia
                      dotacoes={
                        movimentacao.dotacoes
                        && movimentacao.dotacoes.destino
                      }
                      prefixo={movimentacao.pref_dest}
                    />
                  </StyledCardPrimary>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col>
                  <Analise id={movimentacao.id} larger />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Historico
                key={uuid()}
                id={movimentacao.id}
                restricao={consulta}
                mode="left"
              />
            </Col>
          </Row>
          {
            ((acesso === 'partial' && (registro || funciOuPrefixoSolicitante))
              || (acesso === 'full'
              && (registro
              || responsavel === funcionarioLogado)))
              && (
                <Row>
                  <Col>
                    <Parecer
                      key={parecerKey}
                      id={movimentacao.id}
                      acesso={acesso}
                      consulta={!!consulta}
                      updateSelf={this.updateSelf}
                    />
                  </Col>
                </Row>
              )
          }
          <Modal
            title="Ações"
            visible={modalParecerVisible}
            destroyOnClose
            centered
            width="60%"
            onCancel={this.fecharParecer}
            footer={[
              <Button key="close" onClick={this.fecharParecer}>Fechar</Button>
            ]}
          >
            <Parecer
              key={parecerKey}
              id={movimentacao.id}
              acesso={acesso}
              consulta={!!consulta}
              updateSelf={this.updateSelf}
            />
          </Modal>
        </Card>
      )
    );
  }
}

export default connect(null, { getResponsavel })(Movimentacao);
