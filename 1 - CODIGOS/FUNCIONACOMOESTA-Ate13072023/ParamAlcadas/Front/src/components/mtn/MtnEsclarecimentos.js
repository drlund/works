import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  solicitarEsclarecimento,
  fetchEsclarecimentos,
  fetchTimeline,
  downloadAnexo,
} from 'services/ducks/Mtn.ducks';
import {
  ClockCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import moment from 'moment';
import {
  Empty,
  Avatar,
  Typography,
  Collapse,
  Button,
  Modal,
  Row,
  Col,
  Input,
  Descriptions,
  Spin,
  message,
  Tooltip,
  Card,
  Tag,
} from 'antd';
import styled from 'styled-components';
import { getProfileURL } from 'utils/Commons';
import ListaAnexos from 'components/listaAnexos/ListaAnexos';
const EsclarecimentoText = styled.div`
  padding: 20px;
  min-height: 50px;
`;

const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;
class MtnEsclarecimento extends Component {
  state = {
    modalVisible: false,
    loading: false,
    txtEsclarecimento: '',
  };

  solicitarEsclarecimento = () => {
    this.setState({ loading: true }, () => {
      this.props.solicitarEsclarecimento({
        idEnvolvido: this.props.envolvidoAtual.idEnvolvido,
        txtEsclarecimento: this.state.txtEsclarecimento,
        responseHandler: {
          successCallback: () => {
            this.refreshEsclarecimentos();
            this.refreshTimeline();
          },
          errorCallback: () => console.log('Deu tudo errado'),
        },
      });
    });
  };

  refreshTimeline = () => {
    this.setState(() => {
      this.props.fetchTimeline({
        idEnvolvido: this.props.envolvidoAtual.idEnvolvido,
        responseHandler: {
          successCallback: () => this.setState({ loading: false }),
          error: () => message.error('Não foi possível atualizar a timeline'),
        },
      });
    });
  };

  refreshEsclarecimentos = () => {
    this.setState(
      { modalVisible: false, loading: true, txtEsclarecimento: '' },
      () => {
        this.props.fetchEsclarecimentos({
          idEnvolvido: this.props.envolvidoAtual.idEnvolvido,
          responseHandler: {
            successCallback: () => this.setState({ loading: false }),
            error: () =>
              message.error(
                'Não foi possível recuperar a lista de esclarecimentos',
              ),
          },
        });
      },
    );
  };

  renderNovoEsclarecimento = () => {
    if (this.props.status === 'Finalizado') {
      return '';
    }
    return (
      <>
        {
          //Caso já tenha sido analisado, não apresenta o botão para solicitar esclarecimento
          !this.props.readOnly &&
            !this.props.envolvidoAtual.respondidoEm &&
            !this.props.envolvidoAtual.pendenteAprovacao && (
              <Button
                onClick={() => this.setState({ modalVisible: true })}
                type="primary"
                style={{ marginTop: '15px' }}
              >
                Solicitar novo esclarecimento
              </Button>
            )
        }

        <Modal
          title={`Solicitar esclarecimento`}
          centered
          loading={this.state.loading}
          width={800}
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({ modalVisible: false, txtEsclarecimento: '' })
          }
          footer={[
            <Button
              key="back"
              loading={this.state.loading}
              onClick={() =>
                this.setState({ modalVisible: false, txtEsclarecimento: '' })
              }
            >
              Cancelar
            </Button>,
            <Button
              key="salvar"
              type="primary"
              loading={this.state.loading}
              onClick={this.solicitarEsclarecimento}
            >
              Salvar Esclarecimento
            </Button>,
          ]}
        >
          <Spin spinning={this.state.loading}>
            <Row type="flex" align="middle">
              <Col span={4} style={{ marginBottom: '30px' }}>
                <Avatar
                  size={100}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  src={getProfileURL(this.props.envolvidoAtual.matricula)}
                />
              </Col>
              <Col span={20} style={{ marginBottom: '30px' }}>
                <Descriptions bordered>
                  <Descriptions.Item label="Funcionário">
                    {`${this.props.envolvidoAtual.matricula} - ${this.props.envolvidoAtual.nomeFunci}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Prefixo">
                    {`${this.props.envolvidoAtual.cdPrefixoAtual} - ${this.props.envolvidoAtual.nomePrefixoAtual}`}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                <Form layout="vertical" formItemLayout={{ labelAlign: 'left' }}>
                  <Form.Item label="Texto esclarecimento: ">
                    <TextArea
                      onChange={(evt) =>
                        this.setState({ txtEsclarecimento: evt.target.value })
                      }
                      value={this.state.txtEsclarecimento}
                      rows={8}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </>
    );
  };

  renderEsclarecimentoBody = (txtResposta, dataResposta, anexos) => {
    return (
      <div>
        <EsclarecimentoText>
          <Text> {txtResposta} </Text>
        </EsclarecimentoText>
        <div>
          <Text type="secondary">Finalizado em: {dataResposta}</Text>
        </div>
        <Row>
          <Col md={8} xxl={6} style={{ marginTop: 20 }}>
            <ListaAnexos
              downloadAnexo={this.props.downloadAnexo}
              anexos={anexos ? anexos : []}
            />
          </Col>
        </Row>
      </div>
    );
  };

  renderEsclarecimentos = () => {
    let esclarecimentos = this.props.esclarecimentos;
    let arrayEsclarecimentos = [];
    if (!esclarecimentos || esclarecimentos.length === 0) {
      return (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>Nenhum esclarecimento</span>}
          />
        </Card>
      );
    }
    for (let esclarecimento of esclarecimentos) {
      arrayEsclarecimentos.push(
        <Panel
          header={
            <Row style={{ width: '100%' }}>
              <Col span={18}>
                <span>
                  {!esclarecimento.respondidoEm && !esclarecimento.reveliaEm ? (
                    <Tooltip title="Aguardando Resposta">
                      <ClockCircleOutlined
                        style={{ color: 'red', marginRight: '15px' }}
                      />
                    </Tooltip>
                  ) : (
                    ''
                  )}
                  <Avatar
                    style={{ cursor: 'pointer', marginRight: 10 }}
                    src={getProfileURL(esclarecimento.matriculaSolicitante)}
                  />

                  <Text strong>
                    {`${esclarecimento.matriculaSolicitante} - ${esclarecimento.nomeSolicitante}`}
                    :
                  </Text>
                  <Text style={{ marginLeft: 5, textAlign: 'justify' }}>
                    {esclarecimento.txtPedido}
                  </Text>
                </span>
              </Col>

              <Col span={6} style={{ textAlign: 'right' }}>
                <div>
                  <span style={{ display: 'inline-block', marginRight: 10 }}>
                    Dias Trabalhados: {esclarecimento.diasTrabalhados}
                  </span>
                  <span style={{ display: 'inline-block', marginRight: 10 }}>
                    {' '}
                    Prorrogado: {esclarecimento.prorrogado ? 'Sim' : 'Não'}
                  </span>
                  <span style={{ display: 'inline-block' }}>
                    {esclarecimento.lido === true ||
                    esclarecimento.respondidoEm !== null ? (
                      <Tooltip
                        title={
                          esclarecimento.lidoEm === null
                            ? 'Data de leitura não disponível'
                            : `1ª leitura em ${moment(
                                esclarecimento.lidoEm,
                              ).format('DD/MM/YYYY')}`
                        }
                      >
                        <Tag icon={<EyeOutlined />} color="#78D14B">
                          Lido
                        </Tag>
                      </Tooltip>
                    ) : (
                      <Tag icon={<EyeInvisibleOutlined />} color="#F5313B">
                        Não Lido
                      </Tag>
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          }
          key={`collapse_${esclarecimento.id.toString()}`}
        >
          {esclarecimento.txtResposta ? (
            this.renderEsclarecimentoBody(
              esclarecimento.txtResposta,
              esclarecimento.respondidoEm
                ? esclarecimento.respondidoEm
                : esclarecimento.reveliaEm,
              esclarecimento.anexos,
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="danger">
                Pendente de resposta desde {esclarecimento.criadoEm}
              </Text>
            </div>
          )}
        </Panel>,
      );
    }

    return (
      <span>
        <Collapse accordion>{arrayEsclarecimentos}</Collapse>
      </span>
    );
  };

  render() {
    return (
      <Spin spinning={this.state.loading}>
        {this.renderEsclarecimentos()}
        {this.renderNovoEsclarecimento()}
      </Spin>
    );
  }
}

const mapStateToProps = ({ mtn }) => {
  return {
    status: mtn.admOcorrencias.mtnAnalise.dadosBasicos.status,
  };
};

export default connect(mapStateToProps, {
  solicitarEsclarecimento,
  fetchEsclarecimentos,
  downloadAnexo,
  fetchTimeline,
})(MtnEsclarecimento);
