import React, { Component } from 'react';
import { Select } from 'antd';
import uuid from 'uuid/v4';
import RespostaCurta from './RespostaCurta';
import Paragrafo from './Paragrafo';
import MultiplaEscolha from './MultiplaEscolha';
import CaixasdeSelecao from './CaixasdeSelecao';
import ListaSuspensa from './ListaSuspensa';

const Option = Select.Option;

//Tipos de resposta disponiveis
const RespTypes = [
  {
    tipo: 'respostaCurta',
    texto: 'Resposta Curta',
    component: (props) => <RespostaCurta {...props} />
  },
  {
    tipo: 'paragrafo',
    texto: 'Parágrafo',
    component: (props) => <Paragrafo {...props} />
  },
  {
    tipo: 'multiplaEscolha',
    texto: 'Múltiplas Opções', //nome diferente para evitar confusao pelos usuarios
    component: (props) => <MultiplaEscolha {...props} />
  },
  {
    tipo: 'caixasSelecao',
    texto: 'Caixas de Seleção',
    component: props => <CaixasdeSelecao {...props} />
  },
  {
    tipo: 'listaSuspensa',
    texto: 'Lista Suspensa',
    component: props => <ListaSuspensa {...props} />
  }
]

const TipoIndefinido = () => {
  return <div>Tipo não definido.</div>
}

//Funcao que retorna uma lista de options com todas as opcoes
//de tipos de resposta disponiveis no componente. 
export const renderOptionsList = () => {
  return RespTypes.map(item => {
          return <Option key={item.tipo}>{item.texto}</Option>
          });
}
class TipoResposta extends Component {
  constructor(props) {
    super(props);
    this.droppableId = uuid();
  }

  shouldComponentUpdate(newProps) {
    return newProps.tipo === this.props.tipo;
  }

  render() {
    if (!this.props.tipo) {
      return <TipoIndefinido />
    }

    const selectedType = RespTypes.filter(item => item.tipo === this.props.tipo);

    if (!selectedType.length) {
      return <TipoIndefinido />
    }

    const RespComponent = selectedType[0].component;    

    return (
      <div>
        <RespComponent {...this.props} droppableId={this.droppableId} />
      </div>
    )
  }
}

export default TipoResposta;