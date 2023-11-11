import React, { Component } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Table, Input, Button, message, Popconfirm } from 'antd';
import AlfaSort from 'utils/AlfaSort';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import './ItemsList.css';

const { TextArea } = Input;

class ItemsList extends Component {

  state = {
    newItem: '', //item
    descNewItem: '', //descricao
    itemsList : []
  }

  componentDidMount() {
    if (this.props.dataSource) {
      this.setState({ itemsList: this.props.dataSource, newItem: '', descNewItem: '' });
    }
  }

  renderTable = () => {
    let columns = [
      {
        title: this.props.itensColTitle || 'Item',
        dataIndex: "item",
        sorter: (a, b) => AlfaSort(a.item, b.item)
      }
    ];

    if (this.props.showDescription) {
      columns.push(
        {
          title: this.props.itensDescColTitle || 'Descrição',
          dataIndex: "descricao",
          sorter: (a, b) => AlfaSort(a.descricao, b.descricao)
        }
      )
    }

    columns.push(
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          return (
            <span>     
              <Popconfirm title="Deseja excluir este item?" placement="left" onConfirm={() => {this.onRemoveItem(record.id);}} >
                  <DeleteOutlined className="link-color" />
              </Popconfirm>               
            </span>
          );
        }
      }
    );

    return (
      <Table               
        columns={columns} 
        rowKey={() => uuid()}
        dataSource={this.state.itemsList}
        size="small"            
        pagination={{showSizeChanger: true, defaultPageSize: 5}}
      />
    )
  }

  onAddItem = () => {
    let itemText = this.state.newItem.trim();
    let itemDesc = this.state.descNewItem.trim();
    if (itemText.length) {
      //verifica duplicidade
      if ( !this.props.allowDuplicate) {
        let find = false;
        let listLength = this.state.itemsList.length;
        for (let i=0; i < listLength; ++i) {
          if (this.state.itemsList[i].item === itemText) {
            find = true;
            break;
          }
        }
  
        if (find) {
          message.error('Item já está na lista!');
          return;
        }
      }

      let newItem = { id: uuid(), item: itemText, descricao: itemDesc };
      let newList = [...this.state.itemsList, newItem ];
      this.setState({ itemsList: newList }, () => {
        this.props.onListChange(this.state.itemsList);
      });
    }
  }

  onRemoveItem = (id) => {
    let newList = this.state.itemsList.filter(item => item.id !== id);
    this.setState({ itemsList: newList}, () => {
      this.props.onListChange(this.state.itemsList);
    });
  }

  onTextChange = (e) => {
    this.setState({ [e.target.id] : e.target.value });
  }

  render() {
    return (
      <div>
        <Row style={{ marginBottom: '5px'}}>
          <Col span={24}>
            <Input 
              onChange={ (e) => this.onTextChange(e)}
              id="newItem"
              autoComplete="off"
              addonAfter={        
                <Button 
                  icon={<PlusOutlined />} 
                  style={{ marginLeft: '-1px', borderTopLeftRadius: '0', 
                           borderBottomLeftRadius: '0', textShadow: 'none', 
                           boxShadow: 'none' }}
                  type="primary" 
                  onClick={this.onAddItem}
                />
              }
            />
          </Col>
        </Row>

        {
          this.props.showDescription &&
          <Row style={{ marginBottom: '5px'}}>
            <Col span={24}>
              <TextArea 
                onChange={ (e) => this.onTextChange(e)}
                rows={1}
                autoSize
                placeholder="Descrição (opcional)"
                id="descNewItem"
              />
            </Col>
          </Row>
        }

        <Row>
          <Col span={24}>
              {this.renderTable()}
          </Col>
        </Row>
      </div>
    );
  }
}

//propriedades esperadas pelo componente
ItemsList.propTypes = {
  //mostra o campo textarea e coluna da descricao
  showDescription: PropTypes.bool,
  //permite valores duplicados na lista
  allowDuplicate: PropTypes.bool,
  //texto da coluna item na tabela
  itensColTitle: PropTypes.string,
  //texto da coluna descricao na tabela
  itensDescColTitle: PropTypes.string,
  //funcao principal de notificacao de alteracoes na lista de itens
  onListChange: PropTypes.func.isRequired,
  //dados de inicializacao da lista no formato: {id, item, descricao}
  dataSource: PropTypes.array
}

export default ItemsList;
