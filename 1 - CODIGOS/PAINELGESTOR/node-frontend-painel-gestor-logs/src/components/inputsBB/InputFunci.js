import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchFuncis } from 'services/ducks/Arh.ducks';
import { CancelToken, isCancel } from 'services/apis/ApiModel';

const { Option } = Select;

class InputFunci extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      funci: '',
      funcis: [],
      loading: false,
    };

    this.handleSearch = _.debounce(this.handleSearch, 200);
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({ funci: value });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value && prevProps.value === undefined) {
      this.setState({ funci: value }, () => this.handleSearch(value));
    }
  }

  handleSearch = (funci) => {
    const { fetchFuncis: thisFetchFuncis } = this.props;
    if (this.cancelRequest) {
      this.cancelRequest();
    }

    if (funci.length > 2) {
      this.setState({ loading: true, funcis: [] }, () => {
        thisFetchFuncis(
          funci.substr(0, 7),
          true,
          new CancelToken((c) => (this.cancelRequest = c))
        )
          .then((funcis) => {
            this.setState({ funcis, loading: false });

            if (!funcis.length) {
              message.warn('Nenhum funcionário localizado!');
            }
          })
          .catch((error) => {
            if (!isCancel(error)) {
              message.error(error);
              this.setState({ funcis: [], loading: false });
            }
          });
      });
    } else {
      this.setState({ funcis: [], loading: false });
    }
  };

  handleChange = (funci, option) => {
    const {
      wholevalue,
      onChange: thisOnChange,
    } = this.props;
    if (this.cancelRequest) {
      this.cancelRequest();
    }

    /**
     * Se estiver ativado a props wholevalue, retornar toda a option
     * (matrícula, nome e dependência) e não só a matrícula.
    */
    if (wholevalue) {
      const funciValue = funci
        ? option.children.reduce((accumulator, value) => accumulator + value)
        : '';

      this.setState({ funci: funciValue }, () => {
        thisOnChange(funciValue);

        if (!funciValue) {
          this.setState({ funcis: [] });
        }
      });
    } else {
      const thisFunci = funci || '';

      this.setState({ funci: thisFunci }, () => {
        thisOnChange(thisFunci);

        if (!thisFunci) {
          this.setState({ funcis: [] });
        }
      });
    }
  };

  render() {
    const {
      funci,
      funcis,
      loading
    } = this.state;
    const {
      key,
      labelInValue,
      placeholder,
      style
    } = this.props;
    const options = funcis.map((d) => (
      <Option key={d.matricula}>
        {d.matricula}
        {' '}
        {d.nome}
        {' - '}
        {d.prefixo}
        {' '}
        {d.dependencia}
      </Option>
    ));

    const extProps = { ...this.props };
    delete extProps.fetchFuncis;

    return (
      <Select
        {...extProps}
        key={key}
        value={funci}
        showSearch
        labelInValue={labelInValue}
        placeholder={
          placeholder
          || 'Matrícula, nome do funcionário ou prefixo da dependência'
        }
        style={style}
        defaultActiveFirstOption
        allowClear
        showArrow={loading}
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
  fetchFuncis,
})(InputFunci);
