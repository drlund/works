import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchFuncis } from 'services/ducks/Designacao.ducks';
import { CancelToken, isCancel } from 'services/apis/ApiModel';

const { Option } = Select;
let cancelRequest = null;

class InputFunci extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      funci: '',
      funcis: [],
      loading: false
    };

    this.handleSearch = _.debounce(this.handleSearch, 750);
  }

  handleSearch = (funci) => {
    const { tipo } = this.props;
    if (cancelRequest) {
      cancelRequest();
    }

    if (funci.length > 2) {
      this.setState({ loading: true }, () => {
        fetchFuncis(funci, tipo, new CancelToken((c) => (cancelRequest = c)))
          .then((funcis) => this.setState({ funcis, loading: false }))
          .catch((error) => {
            if (!isCancel(error)) {
              this.setState({ funcis: [] });
              message.error(error);
            }
          })
          .then(() => this.setState({ loading: false }));
      });
    } else {
      this.setState({ loading: false, funcis: [] });
    }
  };

  handleChange = (funci) => {
    const { onChange: thisOnChange } = this.props;
    this.setState({ funci }, () => {
      thisOnChange(funci);
    });
  };

  render() {
    const { funcis, funci, loading } = this.state;
    const {
      key, disabled, labelInValue, placeholder, style
    } = this.props;
    const options = funcis.map((d) => (
      <Option key={d.matricula}>
        {d.matricula}
        {' '}
        {d.nome}
      </Option>
    ));

    return (
      <Select
        key={key}
        disabled={disabled}
        showSearch
        labelInValue={labelInValue}
        value={labelInValue ? { value: funci.value, label: funci.label } : funci}
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
      >
        {options}
      </Select>
    );
  }
}

export default connect(null, {
  fetchFuncis
})(InputFunci);
