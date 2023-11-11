import React from 'react';
import "@/App.css";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input, Row, Col, DatePicker } from 'antd';
import AlertList from 'components/alertlist/AlertList';
import { connect } from 'react-redux';
import { updateFormData } from 'services/actions/demandas';
import RichEditor from 'components/richeditor/RichEditor';
import {DefaultGutter} from 'utils/Commons';
import _ from 'lodash';
import moment from 'moment';
import StyledCard from 'components/styledcard/StyledCard';
import 'moment/locale/pt-br';

const Option = Select.Option;

function disabledDate(current) {
  // So permite selecionar datas apos o dia atual e ate 02 meses pra frente.
  return current && (current < moment().endOf('day') || current > moment().add(2, 'month'));
}

class GeralForm extends React.PureComponent {
  static propName = 'geral';

  constructor(props) {
    super(props);
    if (_.isEmpty(this.props.formData)) {
      
      let initialState = { 
        status: 1,
        statusText: 'Em edição',
        titulo: '',
        descricao: '',
        dadosContato: '',
        dataExpiracao: moment().add(1, 'day').toISOString()
      };

      this.props.updateFormData(GeralForm.propName, initialState);
    } else {
      if (! moment(this.props.formData.dataExpiracao).isValid()) {
        this.props.updateFormData(GeralForm.propName, {dataExpiracao: moment().add(1, 'day').toISOString()});
      }
    }
  }

  getStatusText = (status) => {
    switch (status) {
      case 1: return "Em edição";
      case 2: return "Publicada";
      case 3: return "Encerrada";
      default: return "Em edição";
    }
  }
  onStatusChange = (status) => {
    let statusText = this.getStatusText(status);
    this.props.updateFormData(GeralForm.propName, { status, statusText });
  }

  onTextChange = (target) => {
    this.props.updateFormData(GeralForm.propName, { [target.name]: target.value });
  }

  onTextChangeDescricao = (e) => {
    this.props.updateFormData(GeralForm.propName, { descricao: e.target.getContent() });
  }

  onExpiracaoChange = (data) => {
    if (data) {
      this.props.updateFormData(GeralForm.propName, { dataExpiracao: data.toISOString() });
    } else {
      this.props.updateFormData(GeralForm.propName, { dataExpiracao: moment().add(1, 'day').toISOString() });
    }
  }

  render() {
    return (
      <StyledCard title="Configurações Gerais da Demanda">
        <Form layout="vertical">
          <Row gutter={DefaultGutter}>
            <Col span={8}>
              <Form.Item label="Status da Demanda">
                <Select
                  placeholder="Selecione um status"
                  style={{ width: 400 }}
                  value={this.props.formData.status}
                  onChange={this.onStatusChange}
                >
                  <Option value={1}>Em edição</Option>
                  <Option value={2}>Publicada (ativa)</Option>
                  <Option value={3}>Encerrada (apenas consulta)</Option>
                </Select>
              </Form.Item>          
            </Col>
            <Col span={16}>
              <Form.Item label="Data da Expiração">
                <DatePicker 
                  defaultValue={moment(this.props.formData.dataExpiracao)}
                  format="DD/MM/YYYY" 
                  disabledDate={disabledDate} 
                  showToday={false}
                  onChange={this.onExpiracaoChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
              <Form.Item label="Título da Demanda" required>
                <Input                    
                  autoComplete={"off"}
                  name="titulo"
                  defaultValue={this.props.formData.titulo}
                  onBlur={(evt) => this.onTextChange(evt.target)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
              <Form.Item label="Descrição da Demanda" required>
                <RichEditor 
                  height={350} 
                  onBlur={this.onTextChangeDescricao}
                  initialValue={this.props.formData.descricao}
                  customRootDir="demandas"
                />
              </Form.Item>
            </Col>      
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
              <Form.Item label="Dados para contato">
                <Input                     
                  name="dadosContato"
                  defaultValue={this.props.formData.dadosContato}
                  onBlur={(evt) => this.onTextChange(evt.target)}
                />
              </Form.Item>
            </Col>   
          </Row>
        </Form>

        <Row>
          <Col span={24}>
            <AlertList title="Erros Encontrados" messagesList={this.props.errorsList || []}/>
          </Col>
        </Row>

      </StyledCard>
    )
  }
}

const mapStateToProperties = state => {
  return { formData: state.demandas.demanda_atual.geral ? state.demandas.demanda_atual.geral : {},
           errorsList: state.demandas.demanda_erros.geral
         }
}

export default connect(mapStateToProperties, { 
  updateFormData
})(GeralForm);