import React, { Component } from "react";
import { EyeOutlined } from '@ant-design/icons';
import { Tooltip } from "antd";
import ServerSideTable from 'components/serversidetable/ServerSideTable';
import { Link } from "react-router-dom";
import AlfaSort from "utils/AlfaSort";

class MtnEmAndamento extends Component {
  state = {
    loading: false
  };

  columns = [
    {
      dataIndex: "nrMtn",
      title: "Nr. MTN",
      sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
      textSearch: true
    },

    {
      dataIndex: "nomeVisao",
      title: "Visão",
      sorter: true,
      textSearch: true
    },
    {
      dataIndex: "ultimoParecer",
      title: "Último Parecer",
      sorter: false,
      textSearch: false,
      render: (text, record) => {
        return record.ultimoParecer ? record.ultimoParecer : "Não informado";
      }
    },
    {
      dataIndex: "criadoEm",
      title: "Data Criação",
      sorter: true,
      textSearch: true
    },

    {
      title: "Ações",
      align: "center",
      render: (text, record) => {
        return (
          <Tooltip title="Visualizar Análise">
            <Link to={"/mtn/analisar/" + record.id}>
              <EyeOutlined className="link-color" />
            </Link>
          </Tooltip>
        );
      }
    }
  ];

  render() {
    return (  
      <ServerSideTable 
        fetchURL={"/mtn/adm/finalizados"} 
        columns={[...this.columns]}
        size="small"
      />
    )

  }
}

export default MtnEmAndamento;
