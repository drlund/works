import React, { Component } from "react";
import { FormOutlined } from "@ant-design/icons";
import { Tooltip, Spin } from "antd";
import DateBrSort from "utils/DateBrSort";
import { Link } from "react-router-dom";
import ServerSideTable from "components/serversidetable/ServerSideTable";
class MtnEmAndamento extends Component {
  state = {
    loading: false,
  };

  columns = [
    {
      dataIndex: "nrMtn",
      title: "Nr. MTN",
      sorter: true,
      textSearch: true,
      render: (text, record) => {
        return (
          <p>
            {record.nrMtn}
          </p>
        );
      },
    },

    {
      dataIndex: "nomeVisao",
      title: "Visão",
      sorter: true,
      textSearch: true,
      render: (text, record) => {
        return (
          <p>
            {record.nomeVisao}
          </p>
        );
      },
    },
    {
      dataIndex: "qtdEnvolvidos",
      title: "Envolvidos",
      sorter: false,
      textSearch: true,
      customPlaceHolder: "Pesquisar por matrícula",
      render: (text, record) => {
        return (
          <p>
            {record.qtdEnvolvidos}
          </p>
        );
      },
    },

    {
      dataIndex: "criadoEm",
      title: "Data Criação",
      sorter: (a, b) => DateBrSort(a.criadoEm, b.criadoEm),
      render: (text, record) => {
        return (
          <p>
            {record.criadoEm}
          </p>
        );
      },
    },
    {
      title: "Analista Responsavel",
      dataIndex: "analistaResponsavel",
      textSearch: true,
      render: (text, record) => {
        return (
          <p>
            {record.lock === undefined || record.lock === null
              ? "Nenhum analista"
              : `${record.lock.matriculaAnalista} - ${record.lock.nomeAnalista}`}
          </p>
        );
      },
    },
    {
      title: "Ações",
      align: "center",
      render: (text, record) => {
        return (
          <Tooltip title="Conduzir Análise">
            <Link to={"analisar/" + record.id}>
              <FormOutlined className="link-color" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  render() {
    return (
      <Spin spinning={this.props.fetching}>
        <ServerSideTable
          setCustomTrigger={this.props.setCustomTrigger}
          fetchURL={"/mtn/adm/emAndamento"}
          customFields={{ matricula: this.props.matricula }}
          columns={[...this.columns]}
          size="small"
        />
      </Spin>
    );
  }
}

export default MtnEmAndamento;
