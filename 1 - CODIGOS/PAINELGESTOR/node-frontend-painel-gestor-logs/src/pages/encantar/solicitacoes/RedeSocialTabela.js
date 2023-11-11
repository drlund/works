import React from "react";
import { Table, Card } from "antd";

const columns = [
  {
    title: "Rede Social",
    dataIndex: "tipo",
  },
  {
    title: "Usuário",
    dataIndex: "usuario",
  },
  {
    title: "Qtd. Seguidores",
    render: (record, rext) => {
      return record.qtdSeguidores ? (
        <p>{record.qtdSeguidores}</p>
      ) : (
        "Não informado"
      );
    },
  },
];

const RedeSocialTabela = (props) => {
  return (
    <Card>
      <Table
        columns={
          props.actionColumns ? [...columns, props.actionColumn] : columns
        }
        rowKey={(record) => `${record.redeSocial}_${record.qtdSeguidores}`}
        dataSource={props.redesSociais}
        locale={{ emptyText: "Nenhuma rede social incluída." }}
      />
    </Card>
  );
};

export default RedeSocialTabela;
