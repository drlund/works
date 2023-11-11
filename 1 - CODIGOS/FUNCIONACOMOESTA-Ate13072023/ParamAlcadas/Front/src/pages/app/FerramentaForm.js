import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col } from 'antd';
import ItemsList from 'components/itemslist/ItemsList';
import { debounce } from 'throttle-debounce';
import PropTypes from 'prop-types';

class FerramentaForm extends Component {
  
  constructor(props) {
    super(props);
    this.nomeRef = null;
    this.listChangeDebounced = debounce(500, this.props.onFormChange);

    if (props.formData) {
      this.state = { formData: {...props.formData} }
    } else {
      this.state = {
        formData: {
          nomeFerramenta: '',
          listaPermissoes: []
        }        
      }    
    }
  }

  componentDidMount() {
    if (this.nomeRef) {
      this.nomeRef.focus();
    }
  }

  onListChange = (newList) => {
    let newForm = { ...this.state.formData, listaPermissoes: newList }
    this.setState({ formData: newForm }, () => {
      this.props.onFormChange(this.state.formData);
    });
  }

  onChangeFerramenta = (e) => {
    let newForm = { ...this.state.formData, nomeFerramenta: e.target.value }
    this.setState({ formData: newForm }, () => {
      // this.props.onFormChange(this.state.formData);
      this.listChangeDebounced(this.state.formData)
    });  
  }

  render() {
    return (
      <Form layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item label="Nome da Ferramenta">
              <Input                    
                autoComplete={"off"}
                name="ferramenta"
                onChange={(e) => this.onChangeFerramenta(e)}
                defaultValue={this.state.formData.nomeFerramenta}
                ref={(node) => this.nomeRef = node}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="Lista de Permissões">
              <ItemsList 
                showDescription
                onListChange={this.onListChange} 
                dataSource={this.state.formData.listaPermissoes} 
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

FerramentaForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  formData: PropTypes.object
}

export default FerramentaForm;
