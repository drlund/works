import { SearchOutlined } from "@ant-design/icons";
import { Table, Input, Button } from "antd";
import React, { Component } from "react";
import apiModel from "services/apis/ApiModel";

class ServerSideTable extends Component {
  state = {
    data: [],
    filters: {},
    pagination: {
      showSizeChanger: true,
      current: 1,
      showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
    },
    loading: false,
  };

  componentDidMount() {
    this.fetch({ pageSize: 10, page: 1 });
  }

  getColumnSearchProps = (column) => ({
    filterIcon: <SearchOutlined />,
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      console.log(column)
      return (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={ column.customPlaceHolder ?column.customPlaceHolder :`Pesquisar`}
            // placeholder={"Pesquisar"}
            value={selectedKeys}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? e.target.value : "")
            }
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            size="small"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 90, marginRight: 8 }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </div>
      );
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    const fetchParams = {
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    };
    if (this.props.customFields) {
      for (let customField in this.props.customFields) {
        fetchParams[customField] = this.props.customFields[customField];
      }
    }
    this.fetch(fetchParams);
  };

  fetch = (parameters = {}) => {
    this.setState({ loading: true }, () => {
      this.fetchPagination(parameters);
    });
  };

  fetchPagination = async (parameters) => {
    let response = await apiModel.get(this.props.fetchURL, {
      params: {
        ...parameters,
        ...this.props.fetchParams,
      },
    });

      response = response.data;

    const pagination = { ...this.state.pagination };
    // Read total count from server
    pagination.total = response.totalCount;
    pagination.current = parameters.page;
    this.setState({
      loading: false,
      data: response.results,
      filters: response.filters,
      pagination,
    });
  };

  render() {
    const searchColumns = this.props.columns.map((column) => {
      if (column.dataIndex && column.textSearch) {
        return { ...column, ...this.getColumnSearchProps(column) };
      }

      return { ...column };
    });

    return (
      <Table
        dataSource={this.state.data}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        {...this.props}
        columns={searchColumns}
        pagination={{ ...this.state.pagination }}
      />
    );
  }
}

export default ServerSideTable;
