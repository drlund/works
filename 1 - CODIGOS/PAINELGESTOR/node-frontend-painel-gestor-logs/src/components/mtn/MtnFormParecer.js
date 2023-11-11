import React, { Component } from 'react';
import _ from 'lodash';
import { UploadOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import {
  Form,
  Button,
  Upload,
  Input,
  Select,
  Row,
  Col,
  Spin,
  message,
  Alert,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import MaskedInput from 'react-text-mask';
import ModalComplementoNaoAlcancado from './ModalComplementoNaoAlcancado';
import ModalFinalizarSemConsulta from './ModalFinalizarSemConsulta';

import ListaAnexos from 'components/listaAnexos/ListaAnexos';
import { connect } from 'react-redux';
import {
  salvarParecer,
  downloadAnexo,
  removeAnexo,
  fetchMtnStatus,
} from 'services/ducks/Mtn.ducks';

const { TextArea } = Input;
const { Option } = Select;

//Ids de medidas com comportamento específico
const GEDIP = 4;
const GEDIP_FALHA_SERVICO = 7;

class MtnFormParecer extends Component {
  constructor(props) {
    super(props);

    const { idEnvolvido, txtAnalise, medidaSelecionada } =
      this.props.envolvidoAtual;

    this.state = {
      openModalFinalizarSemConsultaDedip: false,
      msgDedipApi: '',
      loading: false,
      dadosForm: {
        [idEnvolvido]: {
          possuiComplemento: false,
          complemento: null,
          fileList: [],
          anexosAnteriores: [],
          txtParecer: txtAnalise,
          medidaSelecionada: medidaSelecionada ? medidaSelecionada.id : null,
        },
      }, //Vai acumulando os dados dos envolvidos, conforme vai acessando cada um deles.
    };
  }

  temEsclarecimentoPendente() {
    const { esclarecimentos } = this.props.envolvidoAtual;

    for (const esclarecimento of esclarecimentos) {
      if (
        esclarecimento.respondidoEm === null &&
        esclarecimento.reveliaEm === null
      ) {
        return true;
      }
    }
    return false;
  }

  temPendenciaAprovacao() {
    return this.props.envolvidoAtual.pendenteAprovacao === true;
  }

  temRecursoPendenteResposta() {
    return (
      this.props.possuiRecursoPendente ||
      this.props.envolvidoAtual.pendenteEnvolvido
    );
  }

  usuarioRegistrouParecerOriginal() {
    const { recursos } = this.props.envolvidoAtual;
    for (const recurso of recursos) {
      if (recurso.matRespAnalise === this.props.usuarioLogado.chave) {
        return true;
      }
    }

    return false;
  }

  /**
   *   Método que indica se o usuário logado tem permissão para finalizar o parecer. Os seguintes casos impedem que ele tenha essa permissão:
   *
   *   1 - Caso tenha algum esclarecimento pendente de resposta
   *   2 - Caso tenha recurso pendente de resposta
   *   3 - Caso tenha recurso já respondido mas o usuário quem deu o parecer original
   *
   */

  podeFinalizarParecer() {
    return !(
      this.temEsclarecimentoPendente() ||
      this.temRecursoPendenteResposta() ||
      // this.usuarioRegistrouParecerOriginal() ||
      this.temPendenciaAprovacao()
    );
  }

  componentWillUpdate(nextProps, nextState) {
    const { idEnvolvido, txtAnalise, medidaSelecionada } =
      nextProps.envolvidoAtual;
    let newDadosForm = this.state.dadosForm;
    //Caso o estado inicial para este envolvido ainda não tenha sido iniciado, inclui as informações
    if (!newDadosForm[idEnvolvido]) {
      newDadosForm[idEnvolvido] = {
        fileList: [],
        txtParecer: txtAnalise,
        medidaSelecionada: medidaSelecionada ? medidaSelecionada.id : null,
      };
      this.setState({ dadosForm: { ...newDadosForm } });
    }
  }

  downloadAnexo = (anexo) => {
    this.props.downloadAnexo({
      idAnexo: anexo.idAnexo,
      fileName: anexo.nomeArquivo,
      responseHandler: {
        successCallback: () => console.log('Baixado'),
        errorCallback: () => message.error('erro no download'),
      },
    });
  };

  salvarParecer = (finalizar, finalizarSemConsultarDedip = false) => {
    
    const dadosFormAtual =
      this.state.dadosForm[this.props.envolvidoAtual.idEnvolvido];
    const arrayErrors = [];

    if (!dadosFormAtual.txtParecer) {
      arrayErrors.push('Informe o texto do parecer.');
    }

    if (
      (dadosFormAtual.medidaSelecionada === GEDIP ||
        dadosFormAtual.medidaSelecionada === GEDIP_FALHA_SERVICO) &&
      !dadosFormAtual.nrGedip
    ) {
      arrayErrors.push('Informe o número do GEDIP.');
    }

    if (
      dadosFormAtual.possuiComplemento === true &&
      (!dadosFormAtual.complemento || dadosFormAtual.complemento.length === 0)
    ) {
      arrayErrors.push('Informe o complemento');
    }

    if (arrayErrors.length > 0) {
      for (let msgErro of arrayErrors) {
        message.error(msgErro);
      }
      return;
    }

    this.setState({ loading: true }, () => {
      
      this.props.salvarParecer({
        idEnvolvido: this.props.envolvidoAtual.idEnvolvido,
        txtParecer: dadosFormAtual.txtParecer,
        arquivos: dadosFormAtual.fileList,
        medida: dadosFormAtual.medidaSelecionada
          ? dadosFormAtual.medidaSelecionada
          : null,
        nrGedip: dadosFormAtual.nrGedip,
        possuiComplemento: dadosFormAtual.possuiComplemento,
        complemento: dadosFormAtual.complemento,
        finalizar,
        finalizarSemConsultarDedip,
        responseHandler: {
          successCallback: (response) => {
            console.log('response');
            console.log(response);

            const { idEnvolvido, anexos, txtAnalise, medidaSelecionada } =
              response;
            const newState = { ...this.state };
            newState.dadosForm[idEnvolvido] = {
              fileList: [],
              anexosAnteriores: anexos,
              txtParecer: txtAnalise,
              medidaSelecionada: medidaSelecionada
                ? medidaSelecionada.id
                : null,
            };
            newState.loading = false;
            this.fetchMtnStatus();
            this.setState(
              {
                ...newState,
              },
              () => message.success('Registro atualizado com sucesso'),
            );
          },
          errorCallback: (error) => {
            if (error.includes('inacessível')) {
              return this.setState(
                {
                  loading: false,
                  msgDedipApi: error,
                  openModalFinalizarSemConsultaDedip: true,
                },
                () => message.error(error),
              );
            }

            if (error.includes('Agravamento requerido')) {
              return this.setState({ loading: false, msgDedipApi: error }, () =>
                message.error(error),
              );
            }

            return this.setState({ loading: false }, () =>
              message.error(error),
            );
          },
        },
      });
    });
  };

  fetchMtnStatus = () => {
    this.props.fetchMtnStatus({
      idMtn: this.props.idMtn,
      responseHandler: {
        successCallback: () =>
          console.log('Dados básicos atualizados com sucesso'),
        errorCallback: () => console.log('Erro ao atualizar dados básicos'),
      },
    });
  };

  renderInputGedip = () => {
    const { idEnvolvido } = this.props.envolvidoAtual;
    if (
      this.state.dadosForm[idEnvolvido].medidaSelecionada === GEDIP ||
      this.state.dadosForm[idEnvolvido].medidaSelecionada ===
        GEDIP_FALHA_SERVICO
    ) {
      return (
        <Col span={6}>
          <MaskedInput
            className="ant-input"
            mask={(rawValue) => {
              const mask = [];
              for (let i = 0; i < rawValue.length; i++) {
                mask.push(/^[0-9]*$/);
              }
              return mask;
            }}
            placeholder="Nr. do Gedip"
            onChange={(evt) =>
              this.handleFormChange(evt.target.value, 'nrGedip')
            }
          />
        </Col>
      );
    }
  };

  handleFormChange = (value, field) => {
    const { idEnvolvido } = this.props.envolvidoAtual;
    let newDadosForm = this.state.dadosForm[idEnvolvido];
    newDadosForm[field] = value;
    if (field === 'medidaSelecionada') {
      newDadosForm.possuiComplemento = false;
      newDadosForm.complemento = null;
    }

    this.setState({
      dadosForm: {
        [idEnvolvido]: { ...newDadosForm },
      },
    });
  };

  /** FILE HANDLERS **/

  removeFile = (arquivoRemovido) => {
    const newState = this.state;
    _.remove(
      newState.dadosForm[this.props.envolvidoAtual.idEnvolvido].fileList,
      (arquivo) => arquivo === arquivoRemovido,
    );

    this.setState({ ...newState });
    return;
  };

  addFile = (file) => {
    const newState = this.state;
    if (file.size / 1000000 > 3) {
      message.error('O tamanho máximo são 3mb.');
      return;
    }
    newState.dadosForm[this.props.envolvidoAtual.idEnvolvido].fileList.push(
      file,
    );
    this.setState({ ...newState });
    return;
  };

  /** RENDER METHODS */

  renderSelectMedidas = () => {
    const { idEnvolvido } = this.props.envolvidoAtual;
    let arrayOptions = [];
    for (let medida of this.props.medidas) {
      arrayOptions.push(<Option value={medida.id}>{medida.txtMedida}</Option>);
    }
    return (
      <Select
        disabled={this.props.possuiRecursoPendente}
        style={{ width: '85%' }}
        placeholder="Medida"
        defaultValue={this.state.dadosForm[idEnvolvido].medidaSelecionada}
        value={this.state.dadosForm[idEnvolvido].medidaSelecionada}
        onChange={(value) => this.handleFormChange(value, 'medidaSelecionada')}
      >
        {arrayOptions}
      </Select>
    );
  };

  renderComplemento = () => {
    const { idEnvolvido } = this.props.envolvidoAtual;
    const { medidaSelecionada } = this.state.dadosForm[idEnvolvido];

    return (
      <Col span={5}>
        <ModalComplementoNaoAlcancado
          idEnvolvido={idEnvolvido}
          medidaSelecionada={medidaSelecionada}
        />
      </Col>
    );
  };

  render() {
    const { idEnvolvido } = this.props.envolvidoAtual;
    if (!this.state.dadosForm[idEnvolvido]) {
      return <span></span>;
    }
    const { fileList } = this.state.dadosForm[idEnvolvido];
    const uploadProps = {
      onRemove: this.removeFile,
      beforeUpload: this.addFile,
      fileList,
    };

    if (this.props.readOnly) {
      return <p>Aguardando Parecer da Super ADM</p>;
    }

    const permiteSalvarRascunho =
      this.props.possuiRecursoPendente ||
      this.temPendenciaAprovacao() ||
      (this.state.dadosForm[idEnvolvido].txtParecer ===
        this.props.envolvidoAtual.txtAnalise &&
        this.state.dadosForm[idEnvolvido].fileList.length === 0 &&
        (this.state.dadosForm[idEnvolvido].medidaSelecionada &&
        this.props.envolvidoAtual.medidaSelecionada?.id
          ? this.props.envolvidoAtual.medidaSelecionada.id ===
            this.state.dadosForm[idEnvolvido].medidaSelecionada
          : !this.state.dadosForm[idEnvolvido].medidaSelecionada));

    return (
      <Spin spinning={this.state.loading}>
        {this.props.envolvidoAtual.pendenteEnvolvido && (
          <Alert
            style={{ marginBottom: 20 }}
            message="Aguarde a resposta do envolvido para finalizar a análise"
            type="error"
          />
        )}

        {this.state.openModalFinalizarSemConsultaDedip ? (
          <ModalFinalizarSemConsulta
            open={this.state.openModalFinalizarSemConsultaDedip}
            onCancel={() =>
              this.setState({
                openModalFinalizarSemConsultaDedip: false,
              })
            }
            onConfirmar={() => this.salvarParecer(true, true)}
          />
        ) : null}

        <Form>
          <Form.Item>
            <TextArea
              disabled={this.props.possuiRecursoPendente}
              onChange={(evt) =>
                this.handleFormChange(evt.target.value, 'txtParecer')
              }
              defaultValue={this.state.dadosForm[idEnvolvido].txtParecer}
              value={this.state.dadosForm[idEnvolvido].txtParecer}
              rows={8}
            />
          </Form.Item>
          <Form.Item>
            <Col
              style={{
                width: '100%',
              }}
            >
              {this.state.msgDedipApi.includes('Agravamento requerido') && (
                <Alert message={this.state.msgDedipApi} banner />
              )}
            </Col>
            <Row>
              <Col span={2}>Medida Selecionada</Col>
              <Col span={10} offset={1}>
                {this.renderSelectMedidas()}
              </Col>
              {this.renderInputGedip()}
              {this.renderComplemento()}
            </Row>
          </Form.Item>
          <div style={{ marginBottom: 20 }}>
            <Upload {...uploadProps}>
              <Button disabled={this.props.possuiRecursoPendente}>
                <UploadOutlined /> Incluir Arquivo
              </Button>
            </Upload>
          </div>
          <Space direction="vertical" align="center">
            <Space>
              <Tooltip title="Para salvar o rascunho altere o texto, a medida ou incluia novos anexos.">
                <Button
                  disabled={permiteSalvarRascunho}
                  type="primary"
                  onClick={() => this.salvarParecer(false)}
                >
                  Salvar Rascunho
                </Button>
              </Tooltip>
              <Popconfirm
                title="Deseja finalizar a análise? Esta operação é irreversível!"
                disabled={!this.podeFinalizarParecer()}
                onConfirm={() => {
                  this.salvarParecer(true);
                }}
                okText="Confirmar"
                cancelText="Não"
              >
                <Button disabled={!this.podeFinalizarParecer()} type="danger">
                  Finalizar Análise
                </Button>
              </Popconfirm>
            </Space>
          </Space>

          <div style={{ marginTop: 15 }}>
            <Spin spinning={this.state.loading}>
              <ListaAnexos
                downloadAnexo={this.props.downloadAnexo}
                removeAnexo={this.props.removeAnexo}
                idEnvolvido={this.props.envolvidoAtual.idEnvolvido}
                anexos={
                  this.props.envolvidoAtual.anexos
                    ? this.props.envolvidoAtual.anexos
                    : []
                }
              />
            </Spin>
          </div>
        </Form>
      </Spin>
    );
  }
}

const mapStateToProps = ({ mtn, app }) => {
  return {
    idMtn: mtn.admOcorrencias.mtnAnalise.dadosBasicos.id,
    usuarioLogado: app.authState.sessionData,
  };
};
export default connect(mapStateToProps, {
  salvarParecer,
  downloadAnexo,
  removeAnexo,
  fetchMtnStatus,
})(MtnFormParecer);
