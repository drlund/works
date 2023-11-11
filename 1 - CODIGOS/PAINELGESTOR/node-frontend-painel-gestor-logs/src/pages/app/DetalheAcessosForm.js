import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import {
  Input,
  Row,
  Col,
  Select,
  Empty,
  Checkbox,
  DatePicker,
  Form,
} from 'antd';
import { debounce } from 'throttle-debounce';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import QuestionHelp from 'components/questionhelp/QuestionHelp';

const { Option } = Select;

const PermissionsContainer = styled.div`
  border: 1px solid #eee;
  padding: 10px;
`;

class DetalheAcessosForm extends Component {
  constructor(props) {
    super(props);
    const { onFormChange } = this.props;
    this.identRef = null;
    this.listChangeDebounced = debounce(500, onFormChange);

    if (!_.isEmpty(props.formData)) {
      const ferramentaPerms = this.getPermissoesFerramenta(
        props.formData.idFerramenta,
      );
      this.state = {
        formData: { ...props.formData },
        ferramentaPerms,
        checkGroupId: uuid(),
      };
    } else {
      this.state = {
        ferramentaPerms: [],
        checkGroupId: uuid(),
        formData: {
          identificador: '',
          permissoes: [],
          idFerramenta: '',
          validade: '',
        },
      };
    }
  }

  componentDidMount() {
    if (this.identRef) {
      this.identRef.focus();
    }
  }

  onChangeText = (e) => {
    const { formData } = this.state;
    const newForm = { ...formData, identificador: e.target.value };
    this.setState({ formData: newForm }, () => {
      this.listChangeDebounced(newForm);
    });
  };

  getPermissoesFerramenta = (idFerramenta) => {
    const { listaFerramentas } = this.props;
    let ferramentaPerms = [];

    if (listaFerramentas) {
      const item = listaFerramentas.filter((elem) => elem.id === idFerramenta);
      if (item.length) {
        ferramentaPerms = item[0].listaPermissoes;
      }
    }

    return ferramentaPerms;
  };

  onChangeFerramenta = (idFerramenta) => {
    const { formData } = this.state;
    const ferramentaPerms = this.getPermissoesFerramenta(idFerramenta);

    const newForm = { ...formData, permissoes: [], idFerramenta };
    this.setState(
      { ferramentaPerms, formData: newForm, checkGroupId: uuid() },
      () => {
        this.listChangeDebounced(newForm);
      },
    );
  };

  onChangeTipo = (tipo) => {
    const { formData } = this.state;

    const newForm = { ...formData, permissoes: [], tipo };
    this.setState({ formData: newForm }, () => {
      this.listChangeDebounced(newForm);
    });
  };

  updatePermissons = (values) => {
    const { formData } = this.state;
    const newForm = { ...formData, permissoes: values };
    this.setState({ formData: newForm }, () => {
      this.listChangeDebounced(newForm);
    });
  };

  renderPermissions = () => {
    const { ferramentaPerms, checkGroupId, formData } = this.state;

    if (ferramentaPerms.length) {
      return (
        <PermissionsContainer>
          <Checkbox.Group
            style={{ lineHeight: '30px' }}
            key={checkGroupId}
            onChange={this.updatePermissons}
            defaultValue={formData.permissoes}
          >
            {ferramentaPerms.map((elem) => (
              <Checkbox value={elem.item} key={elem.id}>
                {elem.item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </PermissionsContainer>
      );
    }

    return <Empty />;
  };

  changeValidade = (data) => {
    const { formData } = this.state;
    const newForm = { ...formData, validade: moment(data, 'DD/MM/YYYY') };
    this.setState({ formData: newForm }, () => {
      this.listChangeDebounced(newForm);
    });
  };

  disabledDate = (current) => current < moment().startOf('day');

  render() {
    const { formData } = this.state;
    const { listaFerramentas, tiposAcesso } = this.props;
    return (
      <Form layout="vertical" name="DetalheAcesso">
        <Row>
          <Col span={24}>
            <Form.Item
              label={
                <>
                  Identificador{' '}
                  <QuestionHelp
                    title={`Matrícula | Prefixo (9999) | UOR (9 posições)
                            | UOR de Trabalho (9 posições) | Comitê Prefixo (C9999)
                            | Comissão (6 posições) | RFO (4 posições)`}
                  />
                </>
              }
            >
              <Row gutter={10}>
                <Col span={10}>
                  <Select
                    defaultValue={formData.tipo}
                    showSearch
                    optionFilterProp="children"
                    placeholder="Selecione o tipo do identificador"
                    disabled={formData.editMode || false}
                    onChange={this.onChangeTipo}
                    filterOption={(input, option) => {
                      const label = ''.concat(...option.children);
                      return (
                        label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {tiposAcesso.map((tipo) => (
                      <Option key={tipo.id} value={tipo.id}>
                        {String(tipo.nome).toUpperCase()}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={14}>
                  <Input
                    autoComplete="off"
                    id="identificador"
                    onChange={(e) => this.onChangeText(e)}
                    defaultValue={formData.identificador}
                    disabled={formData.editMode || false}
                    ref={(node) => (this.identRef = node)}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item label="Data Limite do Acesso">
              <Row>
                <Col>
                  <DatePicker
                    defaultValue={
                      moment(formData.validade).isValid()
                        ? moment(formData.validade)
                        : null
                    }
                    allowClear
                    onChange={this.changeValidade}
                    style={{ width: '100%' }}
                    disabledDate={this.disabledDate}
                    format="DD/MM/YYYY"
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="Ferramenta">
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Selecione a Ferramenta"
                onChange={this.onChangeFerramenta}
                defaultValue={formData.idFerramenta}
                disabled={formData.editMode || false}
                filterOption={(input, option) => {
                  const label = ''.concat(...option.children);
                  return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {listaFerramentas &&
                  listaFerramentas.map((elem) => (
                    <Option key={elem.id} value={elem.id}>
                      {elem.nomeFerramenta}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>{this.renderPermissions()}</Col>
        </Row>
      </Form>
    );
  }
}

DetalheAcessosForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  listaFerramentas: PropTypes.array.isRequired,
};

export default DetalheAcessosForm;
