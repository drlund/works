import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col, message } from "antd";
import { salvarLocalEntregaEditado } from "services/ducks/Encantar.ducks";
import BBSpinning from "components/BBSpinning/BBSpinning";
import FormLocalEntrega from "./FormLocalEntrega";
import isEnderecoClienteValido from "utils/Encantar/isEnderecoClienteValido";
import constants from "utils/Constants";

const { ENCANTAR } = constants;
const { ENTREGA_AGENCIA } = ENCANTAR;

const inicialDadosEntrega = {
  localEntrega: "",
  complementoEntrega: "",
};

const EditarLocalEntrega = (props) => {
  const { solicitacao, fetchSolicitacao } = props;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dadosEntrega, setDadosEntrega] = useState(inicialDadosEntrega);

  const onSalvarLocalEntregaEditado = () => {
    setLoading(true);

    if (!isEnderecoClienteValido(dadosEntrega)) {
      message.error("Endereço não válido");
      setLoading(false);
      return;
    }

    if (
      dadosEntrega.localEntrega === ENTREGA_AGENCIA &&
      !dadosEntrega.prefixoEntrega
    ) {
      message.error("Para entrega da agência, é necessário informar o prefixo");
      return;
    }

    salvarLocalEntregaEditado(solicitacao.id, dadosEntrega)
      .then(() => {
        message.success("Editado com sucesso");
        setShowModal(false);
        fetchSolicitacao();
      })
      .catch((error) => message.error(error))
      .then(() => {
        setLoading(false);
      });
  };

  useState(() => {
    if (props.solicitacao.dadosEntrega) {
      setDadosEntrega({ ...props.solicitacao.dadosEntrega });
    }
  }, [props.solicitacao]);

  useEffect(() => {
    if (showModal === false) {
      setDadosEntrega({ ...props.solicitacao.dadosEntrega });
    }
    return () => {
      setDadosEntrega({ ...props.solicitacao.dadosEntrega });
    };
  }, [showModal, props.solicitacao.dadosEntrega]);

  return (
    <>
      <Button
        type="primary"
        size="small"
        loading={loading}
        onClick={() => {
          setShowModal(true);
        }}
      >
        Editar local de entrega
      </Button>
      <Modal
        width={850}
        title="Editar local de entrega"
        visible={showModal}
        closable={!loading}
        maskClosable={!loading}
        onOk={() => {
          onSalvarLocalEntregaEditado();
        }}
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ loading: loading }}
        onCancel={() => {
          setShowModal(false);
        }}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <BBSpinning spinning={loading}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <FormLocalEntrega
                setDadosEntrega={setDadosEntrega}
                dadosEntrega={dadosEntrega}
              />
            </Col>
          </Row>
        </BBSpinning>
      </Modal>
    </>
  );
};

export default EditarLocalEntrega;
