import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Input, Space, message } from 'antd';
import { postPessoaComite } from '../internalFunctions/apiCalls';
import { handleChangeWithValidations } from "../internalFunctions/handleChangeWithValidations";
import { MesesExpirar } from "./MesesExpirar";

export function IncluirPessoaComite({ addToComite }) {
  const [dados, setDados] = useState({ error: true, month: 0 });
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const matriculaRef = useRef();

  useEffect(() => {
    if (visible && matriculaRef.current) {
      matriculaRef.current.focus();
    }
  }, [visible]);

  const handleChange = handleChangeWithValidations(setDados);

  const handleIncluirClick = async () => {
    setSending(true);
    postPessoaComite({ ...dados })
      .then((newPessoa) => {
        addToComite(newPessoa);
        setDados({ error: true, month: 0 });
        setVisible(false);
      })
      .catch((err) => message.error(`Erro ao alterar pessoa: ${err}`))
      .finally(() => setSending(false));
  };

  const handleShowModal = () => setVisible(v => !v);

  return (
    <>
      <Button type="primary" onClick={handleShowModal}>
        Incluir Pessoa
      </Button>
      <Modal
        visible={visible}
        title={<span style={{ fontWeight: "bold", fontSize: "1.2em" }}>Incluir Pessoa</span>}
        confirmLoading={sending}
        maskClosable
        onCancel={handleShowModal}
        cancelText="Cancelar"
        onOk={handleIncluirClick}
        okText="Incluir"
        okButtonProps={{
          disabled: dados.error || Number(dados.month) === 0,
          loading: sending
        }}
        style={{ height: '100%' }}
      >
        <Space direction="vertical" size="large">
          <Space size="small">
            <Input
              type="text"
              pattern="^[a-zA-Z]\d{7}$"
              data-custom-validation="Matrícula inválida"
              minLength={8}
              maxLength={8}
              onChange={handleChange}
              value={dados.matricula}
              name="matricula"
              placeholder="Matricula"
              ref={matriculaRef}
              style={{ width: 'auto' }}
            />
            <label htmlFor="matricula" style={{ color: 'red', fontSize: "0.8em" }} />
          </Space>
          <MesesExpirar
            handleChange={handleChange}
            dados={dados}
          />
        </Space>
      </Modal>
    </>
  );
}
