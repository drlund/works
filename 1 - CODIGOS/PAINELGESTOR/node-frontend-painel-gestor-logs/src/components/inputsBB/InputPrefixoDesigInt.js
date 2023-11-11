import React from "react";
import { Select, message, Spin } from "antd";
import _ from "lodash";
import { connect } from "react-redux";
import { fetchPrefixosAndSubords } from "services/ducks/Designacao.ducks";
import { CancelToken, isCancel } from "services/apis/ApiModel";

const { Option } = Select;

class InputPrefixo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: { key: "", label: "" },
      data: [],
      prefixo: "",
      loading: false,
    };

    this.handleSearch = _.debounce(this.handleSearch, 750);
  }

  handleSearch = (value) => {
    this.cancelRequest && this.cancelRequest();

    if (value.length > 2) {
      this.setState({ loading: true }, () => {
        this.props.onChange("");

        this.props
          .fetchPrefixosAndSubords(
            value,
            new CancelToken((c) => (this.cancelRequest = c))
          )
          .then((data) => {
            this.setState({ data, loading: false });
            return;
          })
          .catch((error) => {
            if (!isCancel(error)) {
              message.error(error);
              this.setState({ loading: false });
            }
          });
      });
    } else {
      this.setState({ data: [] }, () => {
        this.props.onChange('');
      });
    }
  };

  handleChange = (value) => {
    this.cancelRequest && this.cancelRequest();

    const selectedData = this.state.data.filter(
      (elem) => elem.prefixo === value
    );

    this.setState({ value, data: selectedData }, () => {
      this.props.onChange(value);
    });
  };

  renderOptions = (data) => {
    if (_.isNil(data)) {
      return null;
    }

    let finalOptions = [];

    if (this.props.defaultOptions) {
      finalOptions = this.props.defaultOptions.map((elem) => {
        return (
          <Option key={elem.prefixo}>
            {elem.prefixo} {elem.nome}
          </Option>
        );
      });
    }

    let options = [];

    switch (this.props.dv) {
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
    return (
      <Select
        key={this.props.key}
        disabled={this.props.disabled}
        labelInValue
        showSearch
        autoClearSearchValue={false}
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        allowClear
        filterOption={(input, option) => {
          const label = "".concat(...option.children);
          return (
            label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={this.state.loading ? <Spin size="small" /> : null}
        loading={this.state.loading}
      >
        {this.renderOptions(this.state.data)}
      </Select>
    );
  }
}

export default connect(null, {
  fetchPrefixosAndSubords,
})(InputPrefixo);

//<InputPrefixoDotacao placeholder="input search text" style={{ width: 200 }} />
