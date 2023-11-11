import React from "react";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";

const TIPOS_CONTATO = {
  proprio: "Próprio",
  recado: "Recado",
};

const columns = [
  {
    title: "Tipo",
    sorter: (a, b) => AlfaSort(a.matriculaFunci, b.matriculaFunci),
    render: (text, record) => {
      return TIPOS_CONTATO[record.tipoContato];
    },
  },
  {
    title: "Contato",
    render: (text, record) => {
      return record.contato === TIPOS_CONTATO.proprio ? "-" : record.contato;
    },
  },
  {
    title: "Telefone",
    dataIndex: "telefone",
    sorter: (a, b) => AlfaSort(a.matriculaFunci, b.matriculaFunci),
  },
];

const ContatosCliente = (props) => {
  const { contatos } = props;

  return (
    <SearchTable
      columns={columns}
      dataSource={contatos}
      size="small"
      pagination={{ showSizeChanger: true }}
    />
  );
};

export default ContatosCliente;
