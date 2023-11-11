import React, { Component } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Input, Button } from "antd";
import Highlighter from "react-highlight-words";
import PageLoading from "components/pageloading/PageLoading";
import uuid from "uuid/v4";

import "./TableHead.scss";

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      initial: true,
    };
  }

  getColumnSearchProps = (column) => {
    let columnProps = {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={"Termo a pesquisar"}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            size="small"
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
      ),

      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),

      onFilter: (value, record) =>
        record[column.dataIndex]
          ? record[column.dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : false,
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    };

    if (!column["render"]) {
      columnProps.render = (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={String(text)}
        />
      );
    }

    return columnProps;
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const searchColumns = this.props.columns.map((column) =>
      column.dataIndex &&
      (!column.disableSearch || column.disableSearch === false)
        ? { ...column, ...this.getColumnSearchProps(column) }
        : { ...column }
    );

    //verifica se foi passada a property loading.
    const tmpLoading = this.props.loading
      ? { spinning: this.props.loading, indicator: <PageLoading /> }
      : false;
    const optionals = {};

    if (!this.props.ignoreAutoKey) {
      optionals.rowKey = () => uuid();
    }

    if (!this.props.size) {
      optionals.size = "small";
    }

    let userPagination = this.props.pagination ? this.props.pagination : {};

    //se nao passou o size changer, mostra na tabela por padrao.
    if (typeof userPagination.showSizeChanger === undefined) {
      userPagination.showSizeChanger = true;
    }

    if (typeof userPagination.pageSizeOptions === undefined) {
      userPagination.pageSizeOptions = ["5", "10", "20", "30", "40"];
    }

    return (
      <Table
        // className="styledTableHead"
        {...this.props}
        loading={tmpLoading}
        columns={searchColumns}
        dataSource={this.props.dataSource}
        {...optionals}
        pagination={{
          ...userPagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} itens`,
        }}
      >
        {this.props.children}
      </Table>
    );
  }
}

export default SearchTable;
