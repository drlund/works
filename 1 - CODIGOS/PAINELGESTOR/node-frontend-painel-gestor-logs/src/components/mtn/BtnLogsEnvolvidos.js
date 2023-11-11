import React, { useState } from "react";
import SearchTable from "components/searchtable/SearchTable";
import AlfaSort from "utils/AlfaSort";
import { Button, Modal } from "antd";

const columnsLog = [
  {
    title: "Funcionário",
    sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
    render: (text, record) => {
      return <p>{`${record.matricula} - ${record.nome}`}</p>;
    },
  },
  {
    dataIndex: "created_at",
    title: "Acessado em",
    sorter: (a, b) => AlfaSort(a.matriculaFunci, b.matriculaFunci),
  },
];

const BtnLogsEnvolvidos = (props) => {
  const [showModal, setShowModal] = useState(false);
  const { envolvido } = props;

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);          
        }}
      >
        Acessos Envolvido
      </Button>
      <Modal
        width={600}
        title="Acessos do envolvido à ocorrência"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelText="Fechar"
      >
        <SearchTable
          columns={columnsLog}
          dataSource={envolvido.logs}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </Modal>
    </>
  );
};

export default BtnLogsEnvolvidos;
