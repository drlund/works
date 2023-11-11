import React, { Component } from 'react';
import uuid from 'uuid/v4';
import SearchTable from 'components/searchtable/SearchTable';
import { MonitorOutlined, RedoOutlined, FilePdfOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip, Modal, message, Row, Col, Tag } from 'antd';
import { fetchGedipsConcluidos, fetchFunci, delegarFunci, fillDadosDelegFunci, downloadUploadedPdfDocumentos, dataLimiteResposta } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import { connect } from 'react-redux';
import 'moment/locale/pt-br';
import PageLoading from 'components/pageloading/PageLoading';
import NovaDemanda from './NovaDemanda/NovaDemanda';
import { WrappedDelegFunci as DelegarFunci } from './AdmDemandas/DelegarFunci';
import { VerDadosFunci } from './AdmDemandas/VerDadosFunci';
import _ from 'lodash';
import Text from 'antd/lib/typography/Text';
import EnviarEmail from './AdmDemandas/EnviarEmail';
import { verifyPermission } from 'utils/Commons';
import ComplementoDemissao from './AdmDemandas/ComplementoDemissao';
import AlterarRetorno from './AdmDemandas/AlterarRetorno';
import columns from './Commons/TabelaCtrlDisc';

const { confirm } = Modal;

export class HistDemandas extends Component {

  state = {
    fetching: false,
    modalVisible: false,
    modalTitle: '',
    modalActionsVisible: false,
    modalActionsTitle: '',
    modalConfirmVisible: false,
    funct: '',
    registro: '',
    downloading: false,
    funcao: '',
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchGedipsConcluidos({
        responseHandler: {
          successCallback: this.onFetchList,
          errorCallback: this.onFetchError
        }
      })
    })
  }

  temAcesso = () => {
    return verifyPermission({
      ferramenta: 'Controle Disciplinar',
      permissoesRequeridas: ['ATUALIZAR'],
      authState: this.props.authState
    });
  }

  onFetchList = () => {
    this.setState({ fetching: false });
  }

  onFetchError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error('Falha ao receber a lista de Gedips!');
    }

    this.setState({ fetching: false });
  }

  renderTabelaFuncis = () => {
    let colunas = [
      ...columns,
      {
        dataIndex: 'acoes',
        title: 'Ações',
        width: '5%',
        align: 'center',
        render: (text, record) => {

          const uploaded = _.isEmpty(record.documento);

          let up;

          if (uploaded) {
            up = {
              title: "Documentos Não Enviados",
              type: "exclamation-circle",
              className: "",
              onclick: () => null
            };
          } else {
            up = {
              title: "Baixar Documento Enviado",
              type: "file-pdf",
              className: "link-color link-cursor",
              onclick: () => this.onUploadedDocs(record)
            };
          }

          return (
            <>
              <Tooltip title="Visualizar dados da Demanda GEDIP">
                <MonitorOutlined
                  className="link-color link-cursor"
                  onClick={() => this.actionButton("verDadosFunci", record)} />
              </Tooltip>

              <Divider type="vertical" />

              <Tooltip title={up.title}>
                {
                  up.type === "exclamation-circle" &&
                  <ExclamationCircleOutlined className={up.className} onClick={up.onclick} />
                }
                {
                  up.type === "file-pdf" &&
                  <FilePdfOutlined className={up.className} onClick={up.onclick} />
                }
              </Tooltip>
            </>
          );
        },
      }
    ];

    return (
      <SearchTable
        columns={colunas}
        dataSource={this.props.gedips}
        size="small"
        loading={this.state.fetching}
      />
    )
  }

  onUploadedDocs = (registro) => {
    this.setState({
      downloading: true
    },
      () => {
        this.props.downloadUploadedPdfDocumentos({
          params: {
            id_gedip: registro.id_gedip
          },
          responseHandler: {
            successCallback: (successText) => {
              this.setState({ downloading: false });
            },
            errorCallback: (errMsg, actFn) => {
              message.error("Falha ao baixar o PDF. Contate o administrador do sistema.");
              this.setState({ downloading: false });
            }
          }
        })
      }
    );
  }

  actionButton = (action, registro) => {

    let titulo, funcao;
    switch (action) {
      case 'verDadosFunci':
        titulo = 'Ver Dados GEDIP';
        funcao = <VerDadosFunci registro={registro} />;
        break;
      case 'delegarFunci':
        titulo = 'Delegar Funcionário para a Demanda GEDIP';
        funcao = <DelegarFunci registro={registro} submitFunciDelegado={this.fillDadosDelegFunci} />;
        break;
      case 'enviarEmail':
        titulo = 'Enviar e-mail'
        funcao = <EnviarEmail registro={registro} dismissModal={this.closeActionsModal} />;
        break;
      case 'alterarRetorno':
        titulo = 'Alterar Data de Retorno'
        funcao = <AlterarRetorno gedip={registro} alterarRetorno={this.alterarRetorno} />
        break;
      case 'complementaDemissao':
        titulo = 'Complementar os dados da Demissão'
        funcao = <ComplementoDemissao gedip={registro} />
        break;
      default:
        return message.error('Ação incorreta!');
    }

    return this.openActionsModal(action, titulo, registro, funcao)
  }

  fetchFunci = matricula => {
    this.props.fetchFunci({
      matricula: matricula,
      responseHandler: {
        successCallback: () => this.setState({}),
        errorCallback: () => false
      }
    });
  }

  openActionsModal = (funct, titulo, registro, funcao) => {
    this.setState({
      modalActionsTitle: titulo,
      modalActionsVisible: true,
      funct: funct,
      registro: registro,
      funcao: funcao
    });
  }

  closeActionsModal = () => {
    this.setState({
      modalActionsVisible: false,
      modalActionsTitle: '',
      funct: '',
      funcao: '',
      registro: ''
    });
    this.fetchAllList();
  }

  alterarRetorno = async (data) => {

    const dataInicial = data.toISOString();
    let hasError = false;

    const dia = await this.props.dataLimiteResposta(dataInicial)
      .catch(error => {
        message.error(error);
        hasError = true;
      });

    if (hasError) {
      return '';
    }

    return dia;
  }

  fillDadosDelegFunci = values => {
    this.props.fillDadosDelegFunci({
      dados: values,
      responseHandler: {
        successCallback: () => {
          this.abrirModalConfirmacao()
        },
        errorCallback: () => {
          message.error('Por favor, verifique a matrícula e refaça a delegação!')
        }
      }
    });
  }


  abrirModalConfirmacao = () => {
    this.renderMessageDelegarFunci(this.props.funciResp, this.onConfirmModalOK);
  }

  onConfirmModalCancel = () => {
    this.setState({
      modalConfirmVisible: false,
      modalActionsVisible: false,
      modalVisible: false,
      funct: '',
      registro: '',
      funcao: ''
    }, () => {
      Modal.destroyAll();
      this.fetchAllList();
    });
  }

  onConfirmModalOK = () => {

    this.setState(
      () => {
        this.setState({ saving: true }, () => {
          this.props.delegarFunci(
            {
              responseHandler: {
                successCallback: () => {
                  this.onSaveRespSuccess()
                },
                errorCallback: this.onSaveRespError
              }
            }
          )
        })
      }
    );
  }

  onSaveRespError = (what, action) => {
    this.setState({ saving: false },
      () => {
        message.error(what);
      });
  }

  onSaveRespSuccess = (action) => {
    this.setState({ saving: false },
      () => {
        this.onConfirmModalCancel();
      });
  }

  renderMessageDelegarFunci = (funci, funct) => {
    confirm({
      title: 'Confirma Delegação do Funcionário abaixo para a GEDIP ' + funci.id_gedip + '?',
      content: funci.matricula + ' - ' + funci.nome,
      confirmLoading: true,
      onOk() {
        funct()
      },
      onCancel() {
        console.log('Cancel Confirm');
      },
    });
  }

  renderModalActions = () => {

    return (
      <Modal
        visible={this.state.modalActionsVisible}
        title={this.state.modalActionsTitle}
        centered
        maskClosable={false}
        footer={[
          <Button key="back" type="primary" onClick={this.closeActionsModal}>Fechar</Button>
        ]}
        width={900}
        onCancel={this.closeActionsModal}
        destroyOnClose={true}
      >
        {
          this.state.funcao
        }


      </Modal>
    )
  }

  onSaveError = () => {

  }

  onSaveSuccess = () => {
    this.props.form.resetFields();
    this.closeActionsModal();
  }

  onModalCancel = () => {
    this.setState({
      confirmModalVisible: false
    })
  }

  onUploadDocs = (registro) => {
    let formData = {
      id: registro.id,
      identificador: registro.identificador,
      permissoes: [...registro.permissoes],
    };

    this.setState({
      formData,
      formKey: uuid(),
      title: "Editar Acesso",
      modalVisible: true,
      saveButtonDisabled: false
    });
  }

  openModal = () => {
    this.setState({
      modalVisible: true,
      modalTitle: 'Inclusão de Nova Demanda - GEDIP'
    });
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    });
  }

  renderModal = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        title={this.state.modalTitle}
        centered
        maskClosable={false}
        footer={[
          <Button key="back" onClick={this.closeModal}>Fechar</Button>
        ]}
        width={900}
        onCancel={() => this.closeModal()}
        destroyOnClose={true}
      >
        <div>
          <NovaDemanda formModalClose={this.closeModal} atualizarListaGedips={this.fetchAllList}></NovaDemanda>
        </div>
      </Modal>
    )
  }

  renderActionButtons = () => {
    return (
      <Row style={{ marginBottom: '15px' }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            icon={<RedoOutlined />}
            loading={this.state.fetching}
            style={{ marginLeft: '15px' }}
            onClick={() => this.fetchAllList()}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const isLoading = this.state.fetchingComites || this.state.fetchingMedidas;

    if (isLoading) {
      return <PageLoading></PageLoading>
    }

    return (
      <div>
        <div>
          {this.renderActionButtons()}
        </div>
        <div>
          {this.renderTabelaFuncis()}
        </div>
        <div>
          <Text>Legenda:</Text><br />
          <Text>
            <Tag color="#293462">_</Tag>Não respondido, dentro do prazo
          </Text><br />
          <Text>
            <Tag color="#EC9B3B">_</Tag>Não respondido, menos de dois (02) dias para vencimento
          </Text><br />
          <Text>
            <Tag color="#B22222">_</Tag>Não respondido, fora do prazo
          </Text><br />
          <Text>
            <Tag color="#50C878">_</Tag>Respondido
          </Text><br />
        </div>
        {this.renderModal()}
        {this.renderModalActions()}
      </div>
    )
  }


}

const mapStateToProps = state => {
  return {
    gedips: state.gedip.gedips,
    funciResp: state.gedip.funciResp,
    authState: state.app.authState
  }
}


export default connect(mapStateToProps, { fetchGedipsConcluidos, fetchFunci, delegarFunci, fillDadosDelegFunci, downloadUploadedPdfDocumentos, dataLimiteResposta })(HistDemandas);
