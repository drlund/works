// @ts-nocheck
/**
 * Componente alterado de "/components/inputsBB/InputFunci.js" para retirada de valores não utilizados
 */

import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchFuncis } from 'services/ducks/Arh.ducks';
import { CancelToken, isCancel } from 'services/apis/ApiModel';

const { Option } = Select;

class InputFunciSuspensao extends React.Component {
  /**
   * @param {any} props
   */
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

  /**
   * @param {{ value: any; }} prevProps
   */
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value && prevProps.value === undefined) {
      this.setState({ funci: value }, () => this.handleSearch(value));
    }
  }

  handleSearch = (/** @type {string} */ funci) => {
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
          .then((/** @type {string | any[]} */ funcis) => {
            this.setState({ funcis, loading: false });

            if (!funcis.length) {
              message.warn('Nenhum funcionário localizado!');
            }
          })
          .catch((/** @type {string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | import("antd").MessageArgsProps} */ error) => {
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

  handleChange = (/** @type {string} */ funci, /** @type {{ children: any[]; }} */ option) => {
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
        ? option.children.reduce((/** @type {any} */ accumulator, /** @type {any} */ value) => accumulator + value)
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
      tipoSelecionado,
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
      </Option>
    ));

    if (tipoSelecionado !== 'matricula') {
      return null;
    }

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
          || 'Matrícula, nome do funcionário'
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
})(InputFunciSuspensao);
