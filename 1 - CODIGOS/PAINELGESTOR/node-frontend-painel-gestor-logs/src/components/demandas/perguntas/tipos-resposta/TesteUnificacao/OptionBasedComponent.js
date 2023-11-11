import React, { Component } from 'react'
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Input, Row, Col, Button } from 'antd';
import { DefaultGutter, ReorderDnD } from 'utils/Commons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import OptionValidate from '../../validacoes/OptionValidate';
import uuid from 'uuid/v4';
import _ from 'lodash';
import styled from 'styled-components';
import { DragHandleVertical } from 'components/draghandles/DragHandles';
import DragEndContext from 'components/demandas/perguntas/DragEndContext';
import "@/App.css";

/** Componente com a lista de todas options */
const OptionContainer = styled.div`
  background-color: ${props => props.isDraggingOver ? 'lightgray' : '!important'}
`;

/** Componente que encapsula uma option individual  */
const OptionTemplate = styled.div``;

/** Titulo explicativo do componente multipla escolha */
const Title = styled.label`
  color: rgba(0, 0, 0, 0.85);
`;

/** Template da link para Adicionar novas opcoes  */
const AddOptionTemplate = props => {
  const { WrapperOption } = props;

  return (
    <WrapperOption style={props.style} value="add">
      <label style={{marginRight: '10px'}}>{props.id}.</label>
      <Button 
        className="link-button"                    
        onClick={props.onClick}
      >
        Adicionar um opção
      </Button>
    </WrapperOption>
  )
}

const HandleContainer = styled.label`
  line-height: 25px;
`;

class InnerList extends React.PureComponent {

  render() {
    const { optionsList, WrapperOption, wrapperOptionStyle } = this.props;

    return optionsList.map((option, index) => {
      return (
        <Draggable draggableId={option.id} key={option.id} index={index}>
          { (provided) => (
              <OptionTemplate 
                {...provided.draggableProps}
                ref={provided.innerRef}
              >
                <Row gutter={DefaultGutter}>
                  <Col 
                    s={22} 
                    sm={22} 
                    md={22} 
                    lg={this.props.showValidacao ? 16: 17} 
                    xl={this.props.showValidacao ? 16 : 17} 
                    style={{display: 'inline-flex'}} 
                  >
                    <HandleContainer {...provided.dragHandleProps} >
                      <Icon 
                        component={() => 
                          <DragHandleVertical 
                            style={{verticalAlign: 'middle'}}                          
                          />
                        }                   
                      />
                    </HandleContainer>
                    
                    <WrapperOption key={option.id} style={wrapperOptionStyle} >
                      <label style={{marginRight: '10px'}}>{index+1}.</label>                      
                      <span style={{ ...wrapperOptionStyle, display: 'inline-flex'}}>
                        <Input 
                            style={{marginRight: '10px'}} 
                            autoComplete="off"
                            onChange={(evt) => this.props.handleChangeOption(option.id, {text: evt.target.value})}
                            placeholder="Digite a opção"
                            value={option.text}
                            allowClear
                        />
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => this.props.onRemoveOption(option.id)} 
                        />
                      </span>
                    </WrapperOption>

                  </Col>

                  { this.props.showValidacao && 
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <OptionValidate 
                        idPergunta={this.props.idPergunta}
                        idsList={this.props.idsList}
                        initialState={option.validation}
                        onUpdateStateToParent={ (value) => this.props.handleChangeOption(option.id, { validation: { ...value}})}
                      /> 
                    </Col>
                  }

                </Row>
              </OptionTemplate>
          )}
        </Draggable>
      );
    });
  }
}

class OptionBasedComponent extends React.PureComponent {

  constructor(props) {
    super(props);

    if (_.isEmpty(this.props.initialState)) {
      let id = uuid();
      let option = { id, text: ''};
      this.state = { optionsList: [ option ]};
      this.props.onUpdateStateToParent(this.state);
    } else {
      this.state = { ...this.props.initialState };
    }
  }

  //Metodo Wrapper para qualquer alteracao via setState
  //Repassa o state resultandte ao parent.
  onSetState = (newState) => {
    this.setState({...newState}, () => {
      this.props.onUpdateStateToParent(this.state)
    });
  }

  onAddOption = () => {
    let id = uuid();
    let option = { id, text: ''};
    this.onSetState({ optionsList: [...this.state.optionsList, option ]});
  }

  onRemoveOption = id => {
    let newOptions = this.state.optionsList.filter(option => option.id !== id);
    this.onSetState({ optionsList: newOptions});
  }

  onUpdateOption = (id, newOpt) => {
    let newOptions = [...this.state.optionsList ];
    let optIndex = null;
    newOptions.filter((option, index) => {
      if (option.id === id) {
        optIndex = index;
      }
      return option.id === id
    });

    if (optIndex !== null) {
      newOptions[optIndex] = {...newOptions[optIndex], ...newOpt, id };
    }
    
    this.onSetState({ optionsList: newOptions});
  }

  handleChangeOption = (id, value) => {
    let updated = { id, ...value};
    this.onUpdateOption(id, updated);
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if ( result.type === this.props.droppableId &&
       ( !this.state.lastDragResult || this.state.lastDragResult !== result))
      {
        const options = ReorderDnD(
          this.state.optionsList,
          result.source.index,
          result.destination.index
        );

        this.onSetState({ optionsList: options, lastDragResult: result });
      }
  }

  renderInnerList = (result) => {
    this.onDragEnd(result);
  }

  render() {
    const { GroupListComponent, description } = this.props;

    return (
      <div>
        <Row gutter={DefaultGutter}>
          <Col span={24} style={{paddingBottom: '8px'}}>
              <Title>{description}</Title>
          </Col>
        </Row>

        <Row className={this.state.optionsList.length ? "" : "hidden"}>
          <Col span={24}>
            <GroupListComponent disabled style={{width: '100%'}}>
                <Droppable droppableId={this.props.droppableId} type={this.props.droppableId}>
                  { (provided, snapshot) => (
                    <OptionContainer
                      ref={provided.innerRef}
                      {...provided.droppableProps} 
                      isDraggingOver={snapshot.isDraggingOver} 
                    >
                      <DragEndContext.Consumer>
                        { value => this.onDragEnd(value)}
                      </DragEndContext.Consumer>

                      <InnerList optionsList={this.state.optionsList}
                        handleChangeOption={this.handleChangeOption }
                        onRemoveOption={this.onRemoveOption}
                        showValidacao={this.props.showValidacao}
                        idPergunta={this.props.idPergunta}
                        idsList={this.props.idsList}
                        WrapperOption={this.props.WrapperOption}
                        wrapperOptionStyle={this.props.wrapperOptionStyle}  
                      />

                      {provided.placeholder}
                    </OptionContainer>
                  )}
                </Droppable>
            </GroupListComponent>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <AddOptionTemplate 
              style={{...this.props.wrapperOptionStyle, width: 150, paddingLeft: '24px'}} 
              onClick={this.onAddOption}
              WrapperOption={this.props.WrapperOption}
              id={this.state.optionsList.length + 1}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default OptionBasedComponent;