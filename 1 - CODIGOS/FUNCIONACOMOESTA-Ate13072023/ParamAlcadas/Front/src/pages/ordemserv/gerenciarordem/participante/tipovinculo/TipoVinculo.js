import React, { Component } from 'react'
import VinculoMatriculaIndividual from './VinculoMatriculaIndividual';
import VinculoPrefixo from './VinculoPrefixo';
import Comite from './Comite';
import CargoComissao from './CargoComissao';
import { TIPOS_VINCULOS } from 'pages/ordemserv/Types';

const VinculoTypes = [
  {
    tipo: TIPOS_VINCULOS.MATRICULA_INDIVIDUAL.id,
    component: (props) => <VinculoMatriculaIndividual {...props} />
  },
  {
    tipo: TIPOS_VINCULOS.PREFIXO.id,
    component: (props) => <VinculoPrefixo {...props} />
  },
  {
    tipo: TIPOS_VINCULOS.COMITE.id,
    component: (props) => <Comite tipoVinculo={TIPOS_VINCULOS.COMITE} {...props} />
  },  
  {
    tipo: TIPOS_VINCULOS.CARGO_COMISSAO.id,
    component: (props) => <CargoComissao {...props} />
  }
];

class TipoVinculo extends Component {
  render() {
    if (!this.props.participante.tipoVinculo) {
      return null;
    }

    const selectedType = VinculoTypes.filter(item => item.tipo === this.props.participante.tipoVinculo);

    if (!selectedType.length) {
      return null;
    }

    const VinculoComponent = selectedType[0].component;    

    return (
      <div>
        <VinculoComponent {...this.props} />        
      </div>
    )
  }
}

export default TipoVinculo;
