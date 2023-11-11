import React from 'react';
import {
  Select, Spin
} from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';

import { fetchFuncisLotados, fetchFuncisMovimentados } from 'services/ducks/Designacao.ducks';

const { Option } = Select;

class InputFuncis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      funci: { key: '', label: '' },
      funcis: [],
      funcisMov: [],
      loadingFuncis: false,
    };
  }

  componentDidMount() {
    this.setIsLoading();
    this.loadFuncisLotados();
    this.setIsNotLoading();
  }

  componentDidUpdate(prevProps) {
    const { funcao } = this.props;
    if (!_.isNil(funcao) && prevProps.funcao !== funcao) {
      this.setState({ funci: { key: '', label: '' } });
      this.setIsLoading();
      this.loadFuncisLotados();
      this.setIsNotLoading();
    }
  }

  handleChange = (value) => {
    const { onChange } = this.props;
    this.setState({ funci: value }, () => {
      if (onChange) {
        onChange(value);
      }
    });
  };

  setIsLoading = () => {
    this.setState({ loadingFuncis: true }, () => true);
  };

  setIsNotLoading = () => {
    this.setState({ loadingFuncis: false }, () => true);
  };

  loadFuncisLotados = () => {
    const {
      prefixo,
      funcao,
      fetchFuncisLotados: thisFetchFuncisLotados,
      fetchFuncisMovimentados: thisFetchFuncisMovimentados
    } = this.props;

    if (prefixo === '' && funcao === '') {
      return null;
    }

    Promise.all([
      thisFetchFuncisLotados(prefixo, parseInt(funcao, 10)),
      thisFetchFuncisMovimentados(prefixo, parseInt(funcao, 10))
    ])
      .then((values) => {
        const [thisFuncis, thisFuncisMov] = values;
        this.setState(
          {
            funcis: thisFuncis,
            funcisMov: thisFuncisMov
          },
          this.optionsFuncisLotados
        );
      });

    return true;
  };

  optionsFuncisLotados = () => {
    const { funcis, funcisMov } = this.state;
    const { defaultOptions, funcao } = this.props;

    let finalOptions = [];
    let options = [];

    if (funcis.length) {
      const opts = funcis.filter((el) => el.comissao === funcao);

      options = opts.map((el) => {
        if (el.codFuncLotacao === el.comissao) {
          return (
            <Option key={el.matricula}>
              {el.matricula}
              {' '}
              {el.nome}
            </Option>
          );
        }

        return (
          <Option
            key={el.matricula}
          >
            {/* <Text style={{ background: 'yellow' }}>DESIG/ADIDO ::</Text> */}
            DESIG/ADIDO ::
            {' '}
            {el.matricula}
            {' '}
            {el.nome}
          </Option>
        );
      });
    }

    if (funcisMov.length) {
      let funcisMovim = funcisMov;
      if (funcis.length) {
        const func = funcis.map((el) => el.matricula);
        funcisMovim = funcisMovim.filter((el) => !func.includes(el.matricula));
      }
      const opt2 = funcisMovim.map((el) => (
        <Option key={el.matricula}>
          {/* <Text style={{ background: 'yellow' }}>EM DESIG/ADIÇÃO ::</Text> */}
          EM DESIG/ADIÇÃO ::
          {' '}
          {el.matricula}
          {' '}
          {el.nome}
        </Option>
      ));

      options = options.concat(opt2);
    }

    if (defaultOptions && !funcisMov.length) {
      finalOptions.push(
        <Option
          key={defaultOptions.matricula}
        >
          {defaultOptions.matricula}
          {' '}
          {defaultOptions.nome}
        </Option>
      );
    }

    finalOptions = finalOptions.concat(options);
    return finalOptions;
  };

  render() {
    const { funci, loadingFuncis } = this.state;
    const { disabled } = this.props;
    return (
      <Select
        onChange={this.handleChange}
        labelInValue
        placeholder="Escolha o Funci ausente"
        value={funci}
        loading={loadingFuncis}
        disabled={disabled || loadingFuncis}
        notFoundContent={loadingFuncis ? <Spin size="small" /> : null}
      >
        {this.optionsFuncisLotados()}
      </Select>
    );
  }
}

export default connect(null, {
  fetchFuncisLotados, fetchFuncisMovimentados
})(InputFuncis);
