import React, { useState } from "react";
import { Button, Modal } from "antd";
import PesquisarAusencias from "../pesquisarAusencias/PesquisarAusencias";

const BtnAusenciasFunci = (props) => {
  const { defaultMatricula, disableMatricula, defaultPeriodo, fetchAusenciasFunci } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Ausências Funci
      </Button>
      <Modal
        width={600}
        title="Ausências de envolvido"
        visible={showModal}
        maskClosable={!loading}
        cancelButtonProps={{ loading }}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelText="Fechar"
      >
        <PesquisarAusencias
          loading={loading}
          fetchAusenciasFunci={fetchAusenciasFunci}
          setLoading={setLoading}
          disableMatricula={disableMatricula === undefined ? false : disableMatricula}
          defaultMatricula={defaultMatricula ? defaultMatricula : ""}
          defaultPeriodo={defaultPeriodo}
        />
      </Modal>
    </>
  );
};

export default BtnAusenciasFunci;
