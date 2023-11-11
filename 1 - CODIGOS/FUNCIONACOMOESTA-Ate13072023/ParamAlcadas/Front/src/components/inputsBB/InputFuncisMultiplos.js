import React, { Component } from "react";
import { Select, Spin, message } from "antd";
import _ from "lodash";

import { fetchFuncis } from "services/ducks/Arh.ducks";
import { connect } from "react-redux";

const { Option } = Select;

class InputFuncisMultiplos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      clearForm: false,
      dataFuncis: [],
      funcis: []
    };

    this.onSearchSelectFuncis = _.debounce(this.onSearchSelectFuncis, 800);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value && (prevProps.value === undefined || !value.length)) {
      this.setState({ funcis: value }, () => {
        if (!value.length) {
          this.setState({ dataFuncis: [] });
        }
      });
    }
  }

  onSearchSelectFuncis = (funci) => {    
    this.fetchFuncis(funci);
  };

  onChangeSelectFuncis = (funci) => {
    this.setState({ funcis: funci, dataFuncis: [], fetching: false }, () => {
      if (this.props.onChange) {
        this.props.onChange(funci);
      }
    });
  };

  fetchFuncis = (funci) => {
    if (funci.length > 2) {
      this.setState({ fetching: true }, () => {
        if (this.props.dataFuncis && this.props.dataFuncis.length) {
          const funcisMatched = this.props.dataFuncis.reduce((result, value) => {          
            // Procura pela matrícula
            let funciMatched = (value.matricula.toLowerCase().search(funci.toLowerCase()) >= 0);

            if (!funciMatched) {
              // Procura pelo nome
              funciMatched = (value.nome.toLowerCase().search(funci.toLowerCase()) >= 0);
            }

            if (funciMatched) {
              result.push(value);
            }

            return result;
          }, []);

          this.setState({ dataFuncis: funcisMatched, fetching: false });
        } else {
          this.props
            .fetchFuncis(funci)
            .then((dataFuncis) => {
              this.setState({ dataFuncis, fetching: false });
              return;
            })
            .catch((error) => {
              message.error(error);
              return;
            });
        }
      });
    } else {
      this.setState({ dataFuncis: [] });
    }
  };

  funcisOptions = () => {
    return this.state.dataFuncis.map((el) => {
      return (
        <Option key={el.matricula}>
          {el.matricula} {el.nome}
        </Option>
      );
    });
  };

  render() {
    return (
      <Select
        mode="multiple"
        labelInValue
        style={{ width: "100%" }}
        value={this.state.funcis}
        placeholder="Digite a matrícula ou o nome do funcionário"
        notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
        onSearch={this.onSearchSelectFuncis}
        onChange={this.onChangeSelectFuncis}
        showArrow={false}
        filterOption={false}
      >
        {this.funcisOptions()}
      </Select>
    );
  }
}

export default connect(null, { fetchFuncis })(InputFuncisMultiplos);
