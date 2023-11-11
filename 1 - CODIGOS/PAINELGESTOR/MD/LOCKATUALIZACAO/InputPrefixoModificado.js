import React from 'react';
import { Select, message, Spin, Button } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

class InputPrefixo extends React.Component {
  constructor(props) {
    super(props);
    // const valInicial = this.props.labelInValue ? {key: '', label: ''} : '';
    this.state = {
      value: '',
      data: [],
      // prefixo: '',
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

  handleSearchClick = () => {
    const { onSearchClick } = this.props;
    if (onSearchClick) {
      onSearchClick();
    }
  };

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
    const { data } = this.state;
    const { fullValue, onChange } = this.props;
    const selectedData = value
      ? data.filter((elem) => elem.prefixo === value)
      : [];
    const thisValue = value || '';
    this.setState({ value: thisValue, data: selectedData }, () => {
      onChange(fullValue ? selectedData : thisValue);
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
    const { value, loading, data } = this.state;
    const { key, labelInValue, disabled, mode, placeholder, style, className } =
      this.props;
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
        <div>
          {/* Seu campo de entrada de texto aqui */}
          <Button onClick={this.handleSearchClick}>
            <SearchOutlined />
          </Button>
        </div>
        {this.renderOptions(data)}
      </Select>
    );
  }
}

InputPrefixo.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchMatchedPrefixos,
})(InputPrefixo);
