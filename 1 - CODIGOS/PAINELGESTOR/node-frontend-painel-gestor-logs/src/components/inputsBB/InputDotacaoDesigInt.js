import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchDotacao } from 'services/ducks/Designacao.ducks';

const { Option } = Select;

class InputDotacao extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      funcao: { key: '', label: '' },
      dotacao: [],
      loading: false
    };
  }

  componentDidMount() {
    this.fetchDotacao();
  }

  componentDidUpdate = (prevProps) => {
    if (!_.isNil(this.props.prefixo) && prevProps.prefixo !== this.props.prefixo) {
      this.fetchDotacao();
    }
  }

  handleChange = value => {
    let dotacao = [];
    let terGUN = '';
    let qtdeFuncis = '';

    if (this.props.dotacao && !!value) {
      dotacao = this.state.dotacao.dotacao.filter(elem => {
        return elem.codFuncao === value.value;
      })
      terGUN = this.state.dotacao.terGUN;
      qtdeFuncis = this.state.dotacao.qtdeFuncis;
    } else {
      value = {key: '', label: ''};
    }
    this.setState({ funcao: value }, () => {
      this.props.onFuncaoChange(value, { dotacao: dotacao, terGUN, qtdeFuncis })
    })
  }

  fetchDotacao = () => {
    this.setState({ funcao: { key: '', label: '' }, loading: true }, () => {
      this.props.fetchDotacao(this.props.prefixo, this.props.ger, this.props.gest)
        .then((dotacao) => {
          this.setState({ dotacao: dotacao, loading: false });
        })
        .catch(error => {
          message.error(error);
          this.setState({ loading: false });
        })
    })

  }

  optionsFuncoes = () => {
    if (_.isEmpty(this.state.dotacao)) {
      return <Option disabled key={0}>Prefixo sem Funções Acionáveis</Option>
    }
    return this.state.dotacao.dotacao.map((fn) => {
      return <Option key={fn.codFuncao}>{fn.codFuncao} {fn.nmFuncao}</Option>
    })
  }

  render() {


    return (
      <Select
        onChange={this.handleChange}
        labelInValue
        placeholder="Escolha a Função desejada"
        allowClear
        value={this.state.funcao}
        loading={this.state.loading}
        disabled={this.props.disabled || this.state.loading}
        notFoundContent={this.state.loading ? <Spin size="small" /> : null}
      >
        {this.optionsFuncoes()}
      </Select>
    )
  }

}

export default connect(null, {
  fetchDotacao
})(InputDotacao);
