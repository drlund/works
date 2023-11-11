// @ts-nocheck
import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchListaComissoes } from 'services/ducks/Arh.ducks';

const { Option } = Select;

class InputComissao extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      data: [],
      loading: false,
    };

    this.handleSearch = _.debounce(this.handleSearch, 750);
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({ value });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value) {
      this.setState({ value }, () => this.handleSearch(value));
    }
  }

  handleSearch = (value) => {
    const { fetchListaComissoes: thisfetchListaComissoes } = this.props;

    if (value.length > 2) {
      this.setState({ loading: true }, () => {
        thisfetchListaComissoes(value)
          .then((data) => {
            this.setState({ data, loading: false });

            if (!data.length) {
              message.warn('Nenhuma comissao localizada!');
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
    const { data } = this.state;
    const { fullValue, onChange, comite, nomeComite } = this.props;
    const selectedData = value ? data.filter((elem) => elem.comissao === value) : [];
    const thisValue = value || '';
    this.setState({ value: thisValue, data: selectedData }, () => {
      onChange(fullValue ? selectedData : thisValue, { comite, nomeComite });
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
        <Option key={elem.comissao}>
          {elem.comissao} {elem.nome}
        </Option>
      ));
    }

    let options = [];

    switch (dv) {
      case true: {
        options = data.map((d) => (
          <Option key={d.comissao}>
            {d.comissao}-{d.dv} {d.nome}
          </Option>
        ));
        break;
      }
      default:
        options = data.map((d) => (
          <Option key={d.comissao}>
            {d.comissao} {d.nome}
          </Option>
        ));
    }

    finalOptions = finalOptions.concat(options);
    return finalOptions;
  };

  render() {
    const { value, loading, data } = this.state;
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
      >
        {this.renderOptions(data)}
      </Select>
    );
  }
}

InputComissao.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchListaComissoes,
})(InputComissao);
