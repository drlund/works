// @ts-nocheck
/**
 * Componente recriado a partir de "/components/inputsBB/InputPrefixo.js" para resolver incompatibilidade com uso de componente de mesmo
 * nome mas com parâmetros diferentes .
 */
import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';

const { Option } = Select;

class InputPrefixoAlcada extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      data: [],
      loading: false,
      tipoSelecionado: props.tipoSelecionado || '',
    };

    this.handleSearch = _.debounce(this.handleSearch, 750);
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({ value });
  }

  componentDidUpdate(prevProps) {
    const { value, tipoSelecionado } = this.props;

    if (value !== prevProps.value) {
      this.setState({ value }, () => this.handleSearch(value));
    }
    if (tipoSelecionado !== prevProps.tipoSelecionado) {
      this.setState({ tipoSelecionado }, () => this.handleChange(this.state.value));
    }
  }

  handleSearch = (value) => {
    const { fetchMatchedPrefixos: thisFetchMatchedPrefixos } = this.props;

    if (value.length > 2) {
      this.setState({ loading: true }, () => {
        thisFetchMatchedPrefixos(value)
          .then((data) => {
            this.setState({ data, loading: false });

            if (!data.length) {
              message.warn('Nenhum prefixo localizado!');
            }
          })
          .catch((error) => {
            message.error(error);
            this.setState({ data: [], loading: false });
          });
      });
    } else {
      this.setState({ data: [], loading: false });
    }
  };

  handleChange = (value) => {
    const { data, tipoSelecionado } = this.state;
    const { fullValue, onChange, nomePrefixo, prefixoDestino, comite, nomeComite } = this.props;
    const selectedData = value ? data.filter((elem) => elem.prefixo === value) : [];
    const thisValue = value || '';
    this.setState({ value: thisValue, data: selectedData }, () => {
      if (tipoSelecionado === 'matricula') {
        const formattedValue = thisValue ? `F${thisValue.toUpperCase()}` : '';
        onChange(fullValue ? selectedData : formattedValue, {
          nomePrefixo,
          prefixoDestino,
          comite,
          nomeComite,
        });
      } else {
        onChange(fullValue ? selectedData : thisValue, {
          nomePrefixo,
          prefixoDestino,
          comite,
          nomeComite,
        });
      }
    });
  };

  renderOptions = (data) => {
    const { defaultOptions, dv } = this.props;
    if (_.isNil(data)) {
      return null;
    }

    let finalOptions = [];

    if (defaultOptions) {
      finalOptions = defaultOptions.map((elem) => (
        <Option key={elem.prefixo}>
          {elem.prefixo} {elem.nome}
        </Option>
      ));
    }

    let options = [];

    switch (dv) {
      case true: {
        options = data.map((d) => (
          <Option key={d.prefixo}>
            {d.prefixo}-{d.dv} {d.nome}
          </Option>
        ));
        break;
      }
      default:
        options = data.map((d) => (
          <Option key={d.prefixo}>
            {d.prefixo} {d.nome}
          </Option>
        ));
    }

    finalOptions = finalOptions.concat(options);
    return finalOptions;
  };

  render() {
    const { value, loading, data, tipoSelecionado } = this.state;
    const {
      key,
      labelInValue,
      disabled,
      mode,
      placeholder,
      style,
      className,
    } = this.props;

    return (
      <Select
        key={key}
        labelInValue={labelInValue}
        showSearch
        disabled={disabled}
        mode={mode || ''}
        value={value}
        placeholder={placeholder}
        style={style}
        className={className || ''}
        defaultActiveFirstOption
        allowClear
        showArrow={loading}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
        tipoSelecionado={tipoSelecionado}
      >
        {this.renderOptions(data)}
      </Select>
    );
  }
}

InputPrefixoAlcada.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchMatchedPrefixos,
})(InputPrefixoAlcada);
