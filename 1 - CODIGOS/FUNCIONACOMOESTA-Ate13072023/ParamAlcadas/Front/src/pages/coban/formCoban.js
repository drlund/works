import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import debounce from 'lodash/debounce';
import MaskedInput from 'react-text-mask';

import { fetchMunicipios, fetchPrefixos } from 'services/ducks/Coban.ducks';


import { RedoOutlined } from '@ant-design/icons';


import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';


import { Input, Select, Checkbox, Button, message, Row, Col, Spin } from 'antd';
import PageLoading from '../../components/pageloading/PageLoading.js';

const { Option } = Select;
const { TextArea } = Input;

class RegistrationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      fetchingMun: false,
      fetchingPrefs: false,
      clearForm: false,
      dataPrefs: [],
      dataMun: [],
      prefixos: '',
      município: '',
      contactado: '',
      interessado: '',
    };
    this.onSearchSelectMunicipios = debounce(this.onSearchSelectMunicipios, 800);
    this.onSearchSelectPrefixos = debounce(this.onSearchSelectPrefixos, 800);
  }

  onResetForm = () => {
    this.setState({ clearForm: true }, () => {
      this.setState({ clearForm: false })
    });
  }

  changeContactado = (event) => {
    if (event.target.checked) {
      this.setState({ contactado: 1 });
    } else {
      this.setState({ contactado: '' });
    }
  }

  changeInteressado = (event) => {
    if (event.target.checked) {
      this.setState({ interessado: 1 });
    } else {
      this.setState({ interessado: '' });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        values.ag_madrinha = values.ag_madrinha[0].key;
        values.municipio = values.municipio[0].key;

        values.cnpj = values.cnpj.replace(/\D+/g, '');
        values.telefone_resp = values.telefone_resp.replace(/\D+/g, '');
        values.telefone_resp_1 && (values.telefone_resp_1 = values.telefone_resp_1.replace(/\D+/g, ''));
        values.telefone_resp_2 && (values.telefone_resp_2 = values.telefone_resp_2.replace(/\D+/g, ''));

        _.isNil(values.restr_imped) ? values.restr_imped = 0 : values.restr_imped = 1;
        values.telefone_resp = '+55' + values.telefone_resp;
        values.telefone_resp_1 && (values.telefone_resp_1 = '+55' + values.telefone_resp_1);
        values.telefone_resp_2 && (values.telefone_resp_2 = '+55' + values.telefone_resp_2);
        values.contactado = this.state.contactado;
        values.interessado = this.state.interessado;

        let cadastro = this.sendFormData(values) ? this.cadastroCorreto : this.cadastroIncorreto;
        return cadastro;
      }
    });
  };

  sendFormData = (values) => {
    this.setState({ fetching: true },
      () => {
        this.props.novaIndicacaoCoban({
          dados: values,
          responseHandler: {
            successCallback: () => {
              this.setState({ fetching: false })
              this.props.reset();
            },
            errorCallback: () => {
              message.error('Não foi possível carregar as informações da página. Por favor, recarregue a página!')
            }
          }
        })
      }
    )
  }

  onSearchSelectMunicipios = municipio => {
    if (municipio.length >= 3) {
      this.fetchMunicipios(municipio);
    }
  }

  onChangeSelectMunicipios = municipio => {
    if (municipio.length > 1) {
      municipio.shift();
      municipio = municipio[0];
    }
    this.setState({ municipio: municipio[0], dataMun: [] })
  }

  fetchMunicipios = (value) => {
    this.setState({ fetchingMun: true }, () => {
      this.props.fetchMunicipios({
        dados: value,
        responseHandler: {
          successCallback: () => {
            this.setState({ fetchingMun: false, dataMun: [...this.props.municipios] })
          },
          errorCallback: () => {
            message.error('Não foi possível carregar as informações dos municípios. Por favor, recarregue a página!')
          }
        }
      })
    })
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

  fetchPrefixos = (value) => {
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



  /**Método Render */

  render() {

    if (this.state.clearForm) {
      return <PageLoading />
    }

    const { prefixo, dataPrefs, fetchingPrefs, municipio, dataMun, fetchingMun } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = null;

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign="left">
        <div>
          <Row style={{ marginBottom: '15px' }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                icon={<RedoOutlined />}
                style={{ marginLeft: '15px' }}
                onClick={() => this.onResetForm()}
              >Limpar Campos</Button>
            </Col>
          </Row>
        </div>

        <Form.Item label="Agência Madrinha:">
          {getFieldDecorator('ag_madrinha', {
            rules: [
              {
                required: true,
                message: 'Informe o prefixo da agência madrinha!',
              }
            ],
          })(<Select
            mode="multiple"
            labelInValue
            style={{ width: '100%' }}
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

        <Form.Item label="Informe o CNPJ da empresa (certifique-se que o mesmo está correto):">
          {getFieldDecorator('cnpj', {
            rules: [
              {
                required: true,
                message: 'Informe o CNPJ da empresa'
              }
            ],
          })(<MaskedInput
            className="ant-input"
            mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
            placeholder="00.000.000/0000-00"
          />)}
        </Form.Item>

        <Form.Item label="Nome da empresa:">
          {getFieldDecorator('nome_empresa', {
            rules: [
              {
                type: 'string',
                message: 'Informe o nome da empresa!',
              },
              {
                required: true,
                message: 'Informe o nome da empresa!',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Município:">
          {getFieldDecorator('municipio', {
            rules: [
              {
                required: true,
                message: 'Informe o nome do município!',
              },
            ],
          })(<Select
            mode="multiple"
            labelInValue
            style={{ width: '100%' }}
            setFieldsValue={municipio}
            placeholder="Digite o nome do Município"
            notFoundContent={fetchingMun ? <Spin size="small" /> : null}
            onSearch={this.onSearchSelectMunicipios}
            onChange={this.onChangeSelectMunicipios}
            filterOption={false}
          >
            {dataMun.map(el => {
              return (
                <Option
                  key={el.cd_ibge}
                >{el.municipio + ' - ' + el.uf}
                </Option>
              )
            })}
          </Select>)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Possui Restrição Impeditiva?">
          {getFieldDecorator('restr_imped', {
            rules: [
              {
                required: false
              }
            ]
          })(<Checkbox>Marque, caso "SIM"</Checkbox>)}
        </Form.Item>

        <Form.Item label="Nome do contato/responsável pela empresa:">
          {getFieldDecorator('nome_resp', {
            rules: [
              {
                type: 'string',
                message: 'Informe o nome do contato/responsável pela empresa!',
              },
              {
                required: true,
                message: 'Informe o nome do contato/responsável pela empresa!',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Telefone do contato/responsável pela empresa:">
          {getFieldDecorator('telefone_resp', {
            rules: [
              {
                type: 'string',
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
              {
                required: true,
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
            ],
          })(<MaskedInput
            className="ant-input"
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="(00) 00000-0000"
          />)}
        </Form.Item>

        <Form.Item label="(OPCIONAL) Telefone do contato/responsável pela empresa:">
          {getFieldDecorator('telefone_resp_1', {
            rules: [
              {
                type: 'string',
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
              {
                required: false,
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
            ],
          })(<MaskedInput
            className="ant-input"
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="(00) 00000-0000"
          />)}
        </Form.Item>

        <Form.Item label="(OPCIONAL) Telefone do contato/responsável pela empresa:">
          {getFieldDecorator('telefone_resp_2', {
            rules: [
              {
                type: 'string',
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
              {
                required: false,
                message: 'Informe o telefone do contato/responsável pela empresa!',
              },
            ],
          })(<MaskedInput
            className="ant-input"
            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="(00) 00000-0000"
          />)}
        </Form.Item>

        <Form.Item label="Descreva um pouco sobre o ramo de atividade e atuação da empresa na praça onde está localizada:">
          {getFieldDecorator('descr_atividade', {
            rules: [
              {
                type: 'string',
                message: 'Descreva o ramo da atividade e a atuação da empresa no local!',
              },
              {
                required: true,
                message: 'Descreva o ramo da atividade e a atuação da empresa no local!',
              },
            ],
          })(<TextArea rows={3} />)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('contactado')(
            <Checkbox onChange={this.changeContactado}>Cliente contactado pela Agência (Condição <span style={{fontWeight: 'bold'}}>OBRIGATÓRIA</span> para envio do formulário)</Checkbox>
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('interessado')(
            <Checkbox onChange={this.changeInteressado}>Cliente interessado em se tornar correspondente Mais BB (Condição <span style={{fontWeight: 'bold'}}>OBRIGATÓRIA</span> para envio do formulário)</Checkbox>
          )}
        </Form.Item>

        {
          (this.state.contactado && this.state.interessado) &&
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Cadastrar
            </Button>
          </Form.Item>
        }
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    municipios: state.coban.municipios,
    texto: state.coban.texto,
    prefixos: state.coban.prefixos
  }
}

const WrappedRegistrationForm = Form.create({ name: 'cadastrar' })(RegistrationForm);

export default connect(mapStateToProps, {
  fetchMunicipios,
  fetchPrefixos
})(WrappedRegistrationForm);