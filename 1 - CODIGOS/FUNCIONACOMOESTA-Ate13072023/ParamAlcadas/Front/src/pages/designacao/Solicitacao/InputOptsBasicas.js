import React from 'react';
import { connect } from 'react-redux';
import { Select, Spin, message } from 'antd';
import { getOptsBasicas } from 'services/ducks/Designacao.ducks';
import _ from 'lodash';

const { Option } = Select;

class InputOptsBasicas extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      optBasica: [],
      value: { key: '', label: '' },
    };
  }

  componentDidMount() {
    this.loadOptsBasicas();
  }

  componentDidUpdate(prevProps) {
    const { dadosBasicos } = this.props;
    if (!_.isEqual(prevProps.dadosBasicos, dadosBasicos)) {
      this.loadOptsBasicas();
    }
  }

  // ! Carregar do banco de dados, para uso dinâmico
  loadOptsBasicas = () => {
    const { disabled, getOptsBasicas: thisGetOptsBasicas, dadosBasicos } = this.props;
    if (disabled) return;

    this.setState({ loading: true }, () => {
      thisGetOptsBasicas(dadosBasicos)
        .then((data) => {
          this.setState({ optBasica: data, loading: false });
        })
        .catch((error) => {
          message.error(error);
          this.setState({ loading: false });
        });
    });
  };

  // Preenche o select de opções básicas para validação rápida.
  optionsBasicas = () => {
    const { optBasica } = this.state;

    if (optBasica) {
      return optBasica.map((elem) => <Option key={elem.id}>{elem.texto}</Option>);
    }

    return null;
  };

  // método onChange
  onOptionChange = (value) => {
    const { optBasica } = this.state;
    const { onChange } = this.props;

    this.setState({ value }, () => {
      if (onChange) {
        const [opcao] = optBasica.filter((elem) => elem.id === parseInt(value.key, 10));
        onChange(opcao);
      }
    });
  };

  render() {
    const { value, loading } = this.state;
    const { style, disabled } = this.props;

    return (
      <Select
        value={value}
        labelInValue
        placeholder="Selecione uma das opções"
        style={style}
        defaultActiveFirstOption={false}
        filterOption={false}
        onChange={this.onOptionChange}
        disabled={disabled}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
      >
        {this.optionsBasicas()}
      </Select>
    );
  }
}

export default connect(null, { getOptsBasicas })(InputOptsBasicas);
