import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addGedip, fetchFunci, fetchMedidas, fetchComites, fillDadosNovaGedip, fetchGedip, fetchIns, dataLimiteResposta } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import { fetchPrefixos } from 'services/ducks/Coban.ducks';
import _ from 'lodash';
import PageLoading from 'components/pageloading/PageLoading';
import uuid from 'uuid/v4';
import MaskedInput from 'react-text-mask';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';


import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';


import {
  Input,
  Select,
  Button,
  DatePicker,
  message,
  Modal,
  Checkbox,
  InputNumber,
  Spin,
} from 'antd';

import ModalConfirm from './ModalConfirm';
import TextArea from 'antd/lib/input/TextArea';
import Text from 'antd/lib/typography/Text';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10 },
};
const formTailLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10, offset: 12 },
};

function disabledDate(current) {
  return current < moment().endOf('day');
}

class NovaDemanda extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkNick: false,
      errorList: [],
      saving: false,
      fetchingComites: true,
      fetchingMedidas: true,
      modalConfimKey: uuid(),
      confirmModalVisible: false,
      additionalInfo: false,
      gestorEnvolvido: false,
      medidaSelecionada: '',
      comiteSelecionado: '',
      loadingPage: true,
      fetchingIns: false,
      ins: '',
      dataIns: [],
      fetchingPrefs: false,
      dataPrefs: [],
      prefixos: '',
      comValor: false,
      thinking: false
    };

    this.onSearchSelectIns = _.debounce(this.fetchIns, 800);
    this.onSearchSelectPrefixos = _.debounce(this.onSearchSelectPrefixos, 800);

  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState(
      {
        fetchingComites: true,
        fetchingMedidas: true
      },
      () => {

        this.fetchComites();
        this.fetchMedidas();

      },
    );
  }

  fetchMedidas = () => {
    this.props.fetchMedidas({
      responseHandler: {
        successCallback: (result) => { this.onFetchSuccess(result); this.setState({ fetchingMedidas: false }); },
        errorCallback: this.onFetchError
      }
    });
  }

  fetchComites = () => {
    this.props.fetchComites({
      responseHandler: {
        successCallback: (result) => { this.onFetchSuccess(result); this.setState({ fetchingComites: false }); },
        errorCallback: this.onFetchError
      }
    });
  }

  onSearchSelectIns = ins => {
    this.fetchIns(ins)
  }

  onChangeSelectIns = ins => {
    this.setState({ ins: ins, dataIns: [] })
  }

  fetchIns = (ins) => {
    this.setState({ fetchingIns: true }, () => {
      this.props.fetchIns({
        dados: ins,
        responseHandler: {
          successCallback: () => {
            this.setState({ fetchingIns: false, dataIns: [...this.props.ins] })
          },
          errorCallback: this.onFetchError
        }
      });
    });
  }

  onSearchSelectPrefixos = prefixo => {
    this.fetchPrefixos(prefixo);
  }

  onChangeSelectPrefixos = prefixo => {
    if (prefixo.length > 1) {
      prefixo.shift();
      prefixo = prefixo[0];
    }
    this.setState({ prefixo: prefixo, dataPrefs: [] })
  }

  fetchPrefixos = (value, fn) => {
    this.setState({ fetchingPrefs: true }, () => {
      this.props.fetchPrefixos({
        dados: value,
        responseHandler: {
          successCallback: () => {
            this.setState({ fetchingPrefs: false, dataPrefs: [...this.props.prefixos] })
          },
          errorCallback: () => {
            message.error('Não foi possível carregar as informações dos prefixos. Por favor, recarregue a página!')
          }
        }
      })
    })
  }

  fetchFunci = matricula => {
    this.props.fetchFunci({
      matricula: matricula,
      responseHandler: {
        successCallback: () => { this.abrirModalConfirmacao() },
        errorCallback: () => {
          message.error("Funcionário não localizado. Por favor, verifique a matrícula!")
        }
      }
    });
  }

  fillDadosNovaGedip = (values) => {
    this.props.fillDadosNovaGedip({
      dados: values,
      responseHandler: {
        successCallback: () => {
          this.fetchFunci(values['funcionario_gedip']);
        },
        errorCallback: this.onFetchError
      }
    });
  }

  onFetchSuccess = (fetchFinished) => {
  }

  onFetchError = (what, fetchingError) => {

    message.error(fetchingError);

    this.setState({ [fetchingError]: false });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ thinking: true }, () => true);

    this.props.form.validateFields(async (err, valorCampos) => {
      if (err) this.setState({ thinking: false }, () => true);

      if (!err) {

        const values = {
          'nm_gedip': valorCampos['nm_gedip'],
          'funcionario_gedip': valorCampos['funcionario_gedip'],
          'comite_gedip': valorCampos['comite_gedip'],
          'dt_julgamento_gedip': valorCampos['dt_julgamento_gedip'].format('YYYY-MM-DD'),
          'id_medida': valorCampos['id_medida'],
        }

        if (valorCampos['abrangido_de']) {
          values.abrangido_de = valorCampos['abrangido_de'];
        }

        let dtLimite;

        if (valorCampos['forca_real']) {
          dtLimite = valorCampos['dt_retorno'].startOf('day').add(1, 'days');
          values.dt_retorno = valorCampos['dt_retorno'];
        } else {
          dtLimite = moment().startOf('day').add(1, 'days');
        }

        values.dt_limite_execucao = await this.dataLimiteResposta(dtLimite);

        if (valorCampos['gestor_envolvido']) {
          values.gestor_envolvido = 1
        }

        if (valorCampos['info_adicional'] || valorCampos['id_medida'] === 2) {

          let observacoes_gedip = {};

          if (valorCampos['info_adicional']) {
            let normativos_descumpridos = valorCampos['norm_descumpridos'].map((el) => "IN:" + el.key);

            observacoes_gedip = {
              comite: valorCampos['comite_gedip'],
              descricao_ocorrencia: valorCampos['desc_ocorrencia'],
              normativos_descumpridos: normativos_descumpridos,

            }
            let dp_funci_gedip = valorCampos['dp_funci_gedip'].map((el) => el.label);
            const depfunc = dp_funci_gedip[0];

            let dependencia_funci = [];

            dependencia_funci[0] = depfunc.substring(0, 4);
            dependencia_funci[1] = depfunc.substring(5, depfunc.length);

            observacoes_gedip.dependencia_funci = dependencia_funci;
          }

          if (valorCampos['id_medida'] === 2) {
            observacoes_gedip.vers_in = valorCampos['vers_in'];
            values.valor_gedip = valorCampos['valor_gedip'];
            observacoes_gedip.valor_gedip = valorCampos['valor_gedip'];

            let agencia = valorCampos['agencia'].label;

            const ag = [agencia.substring(0, 6), agencia.substring(7, agencia.length)];

            let cc = valorCampos['cC'].toString();
            cc = cc.slice(0, -1) + '-' + cc.slice(-1);

            observacoes_gedip.agPref = ag;
            observacoes_gedip.cC = cc;

            !(_.isNil(valorCampos['periodo'])) && (observacoes_gedip.periodo = valorCampos['periodo'].format('YYYY-MM-DD'));

            !(_.isNil(valorCampos['valor_prejuizo'])) && (observacoes_gedip.valor_prejuizo = valorCampos['valor_prejuizo']);

            !(_.isNil(valorCampos['desc_ocorrencia'])) && (observacoes_gedip.descricao_ocorrencia = valorCampos['desc_ocorrencia']);

            if (!(_.isNil(valorCampos['norm_descumpridos']))) {
              let normativos_descumpridos = valorCampos['norm_descumpridos'].map((el) => "IN:" + el.key);
              observacoes_gedip.normativos_descumpridos = normativos_descumpridos;
            }

            if (!(_.isNil(valorCampos['dependencia_funci']))) {
              let dependencia_funci = [];
              let depfunc = valorCampos['dependencia_funci'].map((el) => el.label);
              depfunc = depfunc[0];

              dependencia_funci[0] = depfunc.substring(0, 4);
              dependencia_funci[1] = depfunc.substring(5, depfunc.length);

              observacoes_gedip.dependencia_funci = dependencia_funci;
            }

            if (valorCampos['tipo']) values.id_medida = 10;
          }

          values.observacoes_gedip = JSON.stringify(observacoes_gedip);
        }

        if (valorCampos['id_medida'] === 4) {
          values.qtde_dias_suspensao = valorCampos['qtde_dias_suspensao'];
        }

        let errorsList = [];

        if (_.isEmpty(values.nm_gedip)) {
          errorsList.push('Necessário informar o número do registro da GEDIP.');
        }

        if (_.isEmpty(values.funcionario_gedip)) {
          errorsList.push('Necessário informar a matrícula do funcionário envolvido na GEDIP.');
        }

        if (!values.comite_gedip) {
          errorsList.push('Necessário selecionar um dos comitês.');
        }

        if (_.isEmpty(values.dt_julgamento_gedip)) {
          errorsList.push('Necessário informar a data que o comitê julgou este GEDIP.');
        }

        if (values.forca_real) {
          if (_.isEmpty(valorCampos['dt_retorno'])) {
            errorsList.push('Necessário informar a data do retorno do Funci');
          }
        }

        if (!values.id_medida) {
          errorsList.push('Necessário selecionar a decisão/medida julgada para esta GEDIP.');
        }

        if (values.info_adicional) {
          if (!valorCampos['desc_ocorrencia']) {
            errorsList.push('Necessário descrever, de forma sucinta, este processo GEDIP.');
          }
          if (!valorCampos['norm_descumpridos']) {
            errorsList.push('Necessário selecionar/digitar os normativos descumpridos neste processo GEDIP.');
          }
          if (!valorCampos['dp_funci_gedip']) {
            errorsList.push('Necessário informar o prefixo do funci à época deste processo GEDIP.');
          }
        }

        if (errorsList.length) {
          message.error("Preencha todos os campos!");
        } else {
          this.setState(
            {
              errorList: [],
            },
            () => {
              this.fillDadosNovaGedip(values);
            },

          );
        }
      }
    });

  }

  dataLimiteResposta = async (data) => {

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

  checkBoxAdicionalInfo = getFieldDecorator => {
    return (
      <React.Fragment>
        <Form.Item {...formItemLayout} label=" ">
          {getFieldDecorator('info_adicional', {
            rules: [
              {
                required: false
              }
            ]
          })(<Checkbox
            key={uuid()}
            checked={this.state.additionalInfo}
            onChange={this.toggleAdditionalInfo}
          >Informações Adicionais?</Checkbox>)}
        </Form.Item>

        {this.state.additionalInfo &&
          this.complementoForm(getFieldDecorator)
        }
      </React.Fragment>
    );
  }

  toggleAdditionalInfo = () => {

    this.setState(prevState => ({
      additionalInfo: !prevState.additionalInfo
    }));

  }

  inputValor = getFieldDecorator => {
    const { prefixo, dataPrefs, fetchingPrefs, ins, fetchingIns, dataIns } = this.state;

    return (
      <React.Fragment>

        <Form.Item {...formItemLayout} label="Tipo de Documento">
          {getFieldDecorator('tipo', {
            valuePropName: 'checked'
          }
          )
            (<Checkbox>Marque para selecionar <Text strong>ADVERTÊNCIA</Text>,<br />Desmarque para selecionar <Text strong>TERMO DE CIÊNCIA</Text></Checkbox>)
          }
        </Form.Item>

        <Form.Item {...formItemLayout} label="Versão da IN:383-1, na data do julgamento:">
          {getFieldDecorator('vers_in', {
            rules: [
              {
                required: true,
                message: 'Digite o número da versão da IN:383-1 da data do julgamento',
              },
            ],
          })(<InputNumber
            style={{ width: '100%' }}
          />)}

        </Form.Item>

        <Form.Item {...formItemLayout} label="Valor (em R$)">
          {getFieldDecorator('valor_gedip', {
            rules: [
              {
                required: true,
                message: 'Digite o valor da Responsabilidade Pecuniária',
              },
            ],
          })(<InputNumber
            style={{ width: '100%' }}
            decimalSeparator=","
          />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Agência de Débito">
          {getFieldDecorator('agencia', {
            rules: [
              {
                required: true,
                message: 'Informe o prefixo do funcionário à época da ocorrência!',
              }
            ],
            initialValue: prefixo
          })(<Select
            showSearch
            style={{ width: '100%' }}
            labelInValue
            placeholder="Digite o número ou o nome de um prefixo"
            notFoundContent={fetchingPrefs ? <Spin size="small" /> : null}
            onSearch={this.onSearchSelectPrefixos}
            onChange={this.onChangeSelectPrefixos}
            showArrow={false}
            filterOption={false}
            defaultActiveFirstOption={false}
          >
            {dataPrefs.map(el => {
              return (
                <Option
                  key={el.prefixo}
                >{el.prefixo + '-' + el.dv + ' ' + el.nome}
                </Option>
              )
            })}
          </Select>)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Conta Corrente de Débito com DV (sem o traço)">
          {getFieldDecorator('cC', {
            rules: [
              {
                required: true,
                message: 'Digite o número da Conta Corrente com DV',
              },
            ],
          })(<InputNumber
            style={{ width: '100%' }}
          />)}
        </Form.Item>

        {[2, 5, 6].includes(this.state.comiteSelecionado) &&
          <React.Fragment>

            <Form.Item {...formItemLayout} label="Data da Ocorrência">
              {getFieldDecorator('periodo', {
                rules: [
                  {
                    required: true,
                    message: 'Informe a data da ocorrência',
                  },
                ],
              })(<DatePicker
                locale={locale}
                format="DD/MM/YYYY"
                showToday={false}
                style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="Valor do Prejuízo ao Banco do Brasil (em R$)">
              {getFieldDecorator('valor_prejuizo', {
                rules: [
                  {
                    required: true,
                    message: 'Digite o valor do Prejuízo Financeiro ao Banco do Brasil',
                  },
                ],
              })(<InputNumber
                style={{ width: '100%' }}
                decimalSeparator=","
              />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Resumo da participação do Funci">
              {getFieldDecorator('desc_ocorrencia', {
                rules: [
                  {
                    required: true,
                    message: 'Digite de forma sucinta a participação do funci',
                  },
                ],
              })(<TextArea rows={4} placeholder="Digite de forma sucinta a participação do funci" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Normativos Descumpridos">
              {getFieldDecorator('norm_descumpridos', {
                rules: [
                  {
                    required: true,
                    message: 'Digite os Normativos Descumpridos',
                  },
                ],
              })(<Select
                mode="multiple"
                labelInValue
                style={{ width: '100%' }}
                setFieldsValue={ins}
                placeholder="Digite o número ou o título das Instruções Normativas Descumpridas"
                notFoundContent={fetchingIns ? <Spin size="small" /> : null}
                onSearch={this.onSearchSelectIns}
                onChange={this.onChangeSelectIns}
                showArrow={false}
                filterOption={false}
              >
                {dataIns.map(el => {
                  return (
                    <Option
                      key={el.codAssuntoIn}
                    >{'IN:' + el.codAssuntoIn + ' ' + el.titAssuntoIn}
                    </Option>
                  )
                })}
              </Select>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Prefixo do funcionário à época da ocorrência:">
              {getFieldDecorator('dependencia_funci', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o prefixo do funcionário à época da ocorrência!',
                  }
                ],
              })(<Select
                mode="multiple"
                style={{ width: '100%' }}
                labelInValue
                setFieldsValue={prefixo}
                placeholder="Digite o número ou o nome de um prefixo"
                notFoundContent={fetchingPrefs ? <Spin size="small" /> : null}
                onSearch={this.onSearchSelectPrefixos}
                onChange={this.onChangeSelectPrefixos}
                showArrow={false}
                filterOption={false}
              >
                {dataPrefs.map(el => {
                  return (
                    <Option
                      key={el.prefixo}
                    >{el.prefixo + ' ' + el.nome}
                    </Option>
                  )
                })}
              </Select>)}
            </Form.Item>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  inputDiasSuspensao = getFieldDecorator => {

    return (
      <React.Fragment>
        <Form.Item {...formItemLayout} label="Quantidade de dias">
          {getFieldDecorator('qtde_dias_suspensao', {
            rules: [
              {
                required: true,
                message: 'Digite a Quantidade de dias de Suspensão',
              },
            ],
          })(<InputNumber
            min={1}
            max={365}
            defaultValue={1}
            style={{ width: '100%' }}
            placeholder="Digite a Quantidade de dias de Suspensão"
          />)}
        </Form.Item>
        {this.checkBoxAdicionalInfo(getFieldDecorator)}
      </React.Fragment>
    );
  }

  inputAbrangidoDe = getFieldDecorator => {

    return (
      <React.Fragment>
        <Form.Item {...formItemLayout} label="Caso abrangido da GEDIP">
          {getFieldDecorator('abrangido_de', {
            rules: [
              {
                required: true,
                message: 'Digite o número do Processo GEDIP do caso a ser abrangido',
              },
              {
                pattern: /^\d*$/gm,
                message: 'Digite o número do Processo GEDIP corretamente (SOMENTE NÚMEROS)!'
              }
            ],
          })(<Input placeholder="Digite o número do Processo GEDIP do caso a ser abrangido" />)}
        </Form.Item>
      </React.Fragment>
    );
  }

  complementoForm = getFieldDecorator => {
    const { prefixo, dataPrefs, fetchingPrefs, ins, fetchingIns, dataIns } = this.state;

    return (
      <React.Fragment>
        <Form.Item {...formItemLayout}>
          {getFieldDecorator('input_comite', {
            rules: [
              {
                required: false,
              },
            ],
          })(<Input
            hidden={true}
            value={this.state.comiteSelecionado}
          />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Descrição da participação do Funci">
          {getFieldDecorator('desc_ocorrencia', {
            rules: [
              {
                required: true,
                message: 'Digite de forma sucinta a participação do funci',
              },
            ],
          })(<TextArea rows={4} placeholder="Digite de forma sucinta a participação do funci" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Normativos Descumpridos">
          {getFieldDecorator('norm_descumpridos', {
            rules: [
              {
                required: true,
                message: 'Digite os Normativos Descumpridos',
              },
            ],
          })(<Select
            mode="multiple"
            labelInValue
            style={{ width: '100%' }}
            setFieldsValue={ins}
            placeholder="Digite o número ou o título das Instruções Normativas Descumpridas"
            notFoundContent={fetchingIns ? <Spin size="small" /> : null}
            onSearch={this.onSearchSelectIns}
            onChange={this.onChangeSelectIns}
            showArrow={false}
            filterOption={false}
          >
            {dataIns.map(el => {
              return (
                <Option
                  key={el.codAssuntoIn}
                >{'IN:' + el.codAssuntoIn + ' ' + el.titAssuntoIn}
                </Option>
              )
            })}
          </Select>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Dependência do Funci à Época da Irregularidade">
          {getFieldDecorator('dp_funci_gedip', {
            rules: [
              {
                required: true,
                message: 'Digite o prefixo do Funci à época da irregularidade',
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: '100%' }}
            setFieldsValue={prefixo}
            placeholder="Digite o número ou o nome de um prefixo"
            notFoundContent={fetchingPrefs ? <Spin size="small" /> : null}
            onSearch={this.onSearchSelectPrefixos}
            onChange={this.onChangeSelectPrefixos}
            showArrow={false}
            labelInValue
            filterOption={false}
          >
            {dataPrefs.map(el => {
              return (
                <Option
                  key={el.prefixo}
                >{el.prefixo + ' ' + el.nome}
                </Option>
              )
            })}
          </Select>)}
        </Form.Item>
      </React.Fragment>
    );
  }

  onChangeSelectMedidas = event => {
    this.setState(prevState => ({
      medidaSelecionada: event
    }))
  }

  onChangeSelectComites = event => {
    this.setState(prevState => ({
      comiteSelecionado: event
    }))
  }

  toggleForcaReal = () => {

    this.setState(prevState => ({
      forcaReal: !prevState.forcaReal
    }));

  }

  toggleGestorEnvolvido = () => {

    this.setState(prevState => ({
      gestorEnvolvido: !prevState.gestorEnvolvido
    }));

  }

  forcaReal = getFieldDecorator => {
    return (
      <Form.Item {...formItemLayout} label="Data do Retorno">
        {getFieldDecorator('dt_retorno', {
          rules: [
            {
              required: true,
              message: 'Informe a data do Retorno do Funci',
            },
          ],
        })(<DatePicker
          locale={locale}
          format="DD/MM/YYYY"
          showToday={false}
          disabledDate={disabledDate}
          style={{ width: '100%' }} />)}
      </Form.Item>
    );
  }


  optionsAfterChanged = getFieldDecorator => {
    switch (this.state.medidaSelecionada) {
      case 1:
        return this.checkBoxAdicionalInfo(getFieldDecorator);
      // Termo de Ciência
      case 2:
        return this.inputValor(getFieldDecorator);
      //this.checkBoxAdicionalInfo(getFieldDecorator);
      // Responsabilidade Pecuniária
      case 3:
        return this.checkBoxAdicionalInfo(getFieldDecorator);
      // Advertência
      case 4:
        return this.inputDiasSuspensao(getFieldDecorator);
      //this.checkBoxAdicionalInfo(getFieldDecorator);
      // Suspensão
      case 5:
        return this.checkBoxAdicionalInfo(getFieldDecorator);
      // Destituição
      case 6:
        return;
      // Demissão
      case 8:
        return this.inputAbrangidoDe(getFieldDecorator);
      case 11:
        return this.checkBoxAdicionalInfo(getFieldDecorator);
      default:
        return;
    }
  }

  onConfirmOK = () => {

    this.setState({ saving: true }, () => {
      this.props.addGedip(
        {
          responseHandler:
          {
            successCallback: () => {
              this.onModalCancel();
              this.props.formModalClose();
              this.props.atualizarListaGedips();
            },
            errorCallback: this.onSaveError
          }
        }
      )
    });
  }

  onSaveError = () => {
    this.setState({ saving: false });
  }

  onSaveSuccess = (resp) => {
    Modal.destroyAll();
    this.fetchAllList();
  }

  onModalCancel = () => {
    this.setState({
      saving: false,
      confirmModalVisible: false
    })
  }

  ComiteOptions = () => {
    return this.props.comites.map(el => {
      return (
        <Option
          key={el.id_comite}
          value={el.id_comite}
        >{el.nm_comite}
        </Option>
      )
    });
  };

  MedidasOptions = () => {
    return this.props.medidas
      .filter(el => !!el.ativo)
      .map(el => {
        return (
          <Option
            key={el.id_medida}
            value={el.id_medida}
          >{el.nm_medida}
          </Option>
        )
      });
  };


  abrirModalConfirmacao = () => {
    this.setState({ thinking: false, modalConfimKey: uuid(), confirmModalVisible: true });
  }

  renderModalConfirmacao = () => {

    return (
      <Modal
        title="Confirmação de Inclusão de GEDIP"
        visible={this.state.confirmModalVisible}
        onCancel={this.onModalCancel}
        onOk={this.onConfirmOK}
        width={800}
        closable={false}
        confirmLoading={this.state.saving}
        maskClosable={false}
      >
        <div>
          <ModalConfirm
            key={this.state.modalConfimKey}
          />
        </div>
      </Modal>
    );
  }

  render = () => {

    const { getFieldDecorator } = this.props.form;
    const isLoading = this.state.fetchingComites || this.state.fetchingMedidas || this.state.thinking;

    if (isLoading) {
      return <PageLoading />
    }
    return (
      <>
        <Form.Item {...formItemLayout} label="No. GEDIP">
          {getFieldDecorator('nm_gedip', {
            rules: [
              {
                required: true,
                message: 'Digite o número do Processo GEDIP',
              },
              {
                pattern: /^\d*$/gm,
                message: 'Digite o número do Processo GEDIP corretamente (SOMENTE NÚMEROS)!'
              }
            ],
          })(<Input placeholder="Digite o número do Processo GEDIP" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Matrícula">
          {getFieldDecorator('funcionario_gedip', {
            rules: [
              {
                required: true,
                message: 'Digite a matrícula do Funcionário sujeito da GEDIP',
              },
              {
                pattern: /^F\d{7}$/gm,
                message: 'Digite a matrícula do Funcionário sujeito da GEDIP corretamente!'
              }
            ]
          })(
            <MaskedInput
              className="ant-input"
              mask={['F', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
              placeholder="F0000000"
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label=" ">
          {getFieldDecorator('gestor_envolvido', {
            rules: [
              {
                required: false
              }
            ]
          })(<Checkbox
            key={uuid()}
            checked={this.state.gestorEnvolvido}
            onChange={this.toggleGestorEnvolvido}
          >1o. Gestor do Funci envolvido na GEDIP?</Checkbox>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Comitê">
          {getFieldDecorator('comite_gedip', {
            rules: [
              {
                required: true,
                message: 'Selecione um Comitê',
              },
            ]
          })(<Select
            showSearch
            key={uuid()}
            style={{ width: '100%' }}
            placeholder="Selecione um Comitê"
            optionFilterProp="children"
            onChange={this.onChangeSelectComites}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.ComiteOptions()}
          </Select>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Data do Julgamento">
          {getFieldDecorator('dt_julgamento_gedip', {
            rules: [
              {
                required: true,
                message: 'Informe a data do Julgamento',
              },
            ],
          })(<DatePicker
            locale={locale}
            format="DD/MM/YYYY"
            showToday={false}
            style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label=" ">
          {getFieldDecorator('forca_real', {
            rules: [
              {
                required: false
              }
            ]
          })(<Checkbox
            key={uuid()}
            checked={this.state.forcaReal}
            onChange={this.toggleForcaReal}
          >Força <Text style={{ fontWeight: "bold", fontSize: "1.3em", color: 'red' }}>NÃO</Text> Real de Trabalho?</Checkbox>)}
        </Form.Item>
        {
          this.state.forcaReal &&
          this.forcaReal(getFieldDecorator)
        }
        <Form.Item {...formItemLayout} label="Decisão/Medida Aplicada">
          {getFieldDecorator('id_medida', {
            rules: [
              {
                required: true,
                message: 'Selecione uma Decisão/Medida',
              },
            ],
          })(<Select
            showSearch
            key={uuid()}
            style={{ width: '100%' }}
            placeholder="Selecione uma Decisão/Medida"
            optionFilterProp="children"
            onChange={this.onChangeSelectMedidas}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.MedidasOptions()}

          </Select>)}
        </Form.Item>
        {this.optionsAfterChanged(getFieldDecorator)}
        <Form.Item {...formTailLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            Incluir
          </Button>
        </Form.Item>
        {this.renderModalConfirmacao()}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    funcionarioGedip: state.gedip.funcionarioGedip,
    funciLogged: state.app.authState.sessionData,
    comites: state.gedip.comites,
    medidas: state.gedip.medidas,
    dadosGedip: state.gedip.dadosGedip,
    confirmModalVisible: state.gedip.confirmModalVisible,
    ins: state.gedip.ins,
    prefixos: state.coban.prefixos,
  }
}

const WrappedNovaDemanda = Form.create({ name: 'nova_demanda' })(NovaDemanda)

export default connect(mapStateToProps, {
  addGedip, fetchMedidas, fetchComites, fetchFunci, fillDadosNovaGedip, fetchGedip, fetchIns, fetchPrefixos, dataLimiteResposta
})(WrappedNovaDemanda);