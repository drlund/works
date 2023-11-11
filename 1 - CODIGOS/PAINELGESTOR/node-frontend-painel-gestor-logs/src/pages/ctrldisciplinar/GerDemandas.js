import React, { Component } from 'react';
import uuid from 'uuid/v4';
import PageLoading from 'components/pageloading/PageLoading';
import SearchTable from 'components/searchtable/SearchTable';
import { FilePdfOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip, Modal, message, Row, Col, Tag } from 'antd';
import { fetchGedips, enviarUploadedFile, downloadPdfDocumentos, downloadPdfDocumentosEnviados, downloadUploadedPdfDocumentos } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import { connect } from 'react-redux';
import 'moment/locale/pt-br';
import UploadFile from './GerDemandas/UploadFile';
import { DownloadFile } from './GerDemandas/DownloadFile';
import _ from 'lodash';
import Text from 'antd/lib/typography/Text';
import columns from './Commons/TabelaCtrlDisc';


export class GerDemandas extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      modalVisible: false,
      modalTitle: '',
      modalKey: '',
      searching: false,
      temAcesso: '',
      modalMode: '',
      id_gedip: '',
      downloading: false,
      registro: {}
    }

  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchGedips({
        responseHandler: {
          successCallback: this.onFetchList,
          errorCallback: this.onFetchError
        }
      })
    })
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
        key: uuid(),
        dataIndex: 'acoes',
        title: 'Ações',
        width: '2%',
        align: 'center',
        render: (text, record) => {

          const uploaded = _.isEmpty(record.documento);

          const exibe = record.status_gedip === 1 || record.status_gedip === 4 || record.status_gedip === 5;

          let up;

          if (uploaded) {
            up = {
              title: "Documentos Não Enviados",
              type: "exclamation-circle",
              className: "",
              onclick: () => this.onUploadDocs(record)
            };
          } else {
            up = {
              title: "Baixar Documento Enviado",
              type: "file-pdf",
              className: "link-color link-cursor",
              onclick: () => this.onUploadedDocs(record)
            };
          }

          let display = null;

          if (exibe) {
            display = (
              <div>
                <Tooltip title="Baixar Arquivos para Impressão">
                  <FilePdfOutlined
                    className={record.isGestor ? "link-color link-cursor" : ""}
                    onClick={() => record.isGestor && up.type !== 'file-pdf' ? this.onDownloadDocs(record) : null} />
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
              </div>
            )
          }

          return display;
        },
      }
    ];

    return (
      <SearchTable
        columns={colunas}
        dataSource={this.props.gedips}
        size="small"
        loading={this.state.searching ? { spinning: this.state.searching, indicator: <PageLoading /> } : false}
      />
    )
  }

  onUploadDocs = (registro) => {
    this.setState({
      modalKey: uuid(),
      modalTitle: "Enviar Documentos Digitalizados",
      modalVisible: true,
      modalMode: 'up',
      id_gedip: registro.id_gedip,
      registro: registro,
    });
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
              this.setState({
                downloading: false
              });
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

  onDownloadDocs = (registro) => {
    this.setState({
      downloading: true,
      id_gedip: registro.id_gedip,
      registro: registro
    },
      () => {
        this.props.downloadPdfDocumentos({
          params: this.state.registro,
          responseHandler: {
            successCallback: (successText) => {
              this.downloadPdfDocumentos();
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

  downloadPdfDocumentos = () => {
    this.setState({},
      () => {
        this.props.downloadPdfDocumentosEnviados({
          responseHandler: {
            successCallback: (successText) => {
              this.setState({
                downloading: false
              });
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

  renderModal = () => {
    const { linkPdfUp } = this.props;

    return (
      <Modal
        visible={this.state.modalVisible}
        title={this.state.modalTitle}
        centered={true}
        width={700}
        onCancel={this.onModalClose}
        maskClosable={false}
        destroyOnClose={true}
        footer={
          [
            <Button key="back" onClick={this.onModalClose}>Fechar</Button>,
          ]
        }
      >
        {
          this.state.modalMode === 'up'
            ? <UploadFile id_gedip={this.state.id_gedip} onConfirmModalOK={this.onConfirmModalOK} />
            : (
              this.state.modalMode === 'down'
                ? <DownloadFile linkPdfUp={linkPdfUp} />
                : null
            )
        }
      </Modal>
    )
    /* <DownloadFile downloadPdfDocumentos={this.downloadPdfDocumentos} /> */
    // DownloadFile id_gedip={this.state.id_gedip} downloadPdfDocumentos={this.downloadPdfDocumentos} />
  }

  onModalClose = () => {
    this.setState({
      modalVisible: false,
      modalTitle: '',
      modalKey: '',
      modalMode: '',
      id_gedip: '',
    })
  }


  onConfirmModalOK = (dados) => {

    this.setState(
      () => {
        this.setState({ saving: true }, () => {
          this.props.enviarUploadedFile(
            {
              dados: dados,
              responseHandler: {
                successCallback: () => {
                  this.onSaveRespSuccess()
                },
                errorCallback: () => {
                  this.onSaveRespError()
                },
              }
            }
          )
        })
      }
    );
  }

  onSaveRespSuccess = () => {
    this.setState({
      modalVisible: false,
    });
    this.fetchAllList();
  }

  onSaveRespError = () => {
    message.error('Erro ao enviar arquivo. Favor tentar novamente!');
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

    if (this.state.fetching) {
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
      </div>
    )
  }


}

const mapStateToProps = state => {
  return {
    gedips: state.gedip.gedips,
    authState: state.app.authState,
    linkPdfUp: state.gedip.linkPdfUp,
  }
}


export default connect(mapStateToProps, { fetchGedips, enviarUploadedFile, downloadPdfDocumentos, downloadPdfDocumentosEnviados, downloadUploadedPdfDocumentos })(GerDemandas);
