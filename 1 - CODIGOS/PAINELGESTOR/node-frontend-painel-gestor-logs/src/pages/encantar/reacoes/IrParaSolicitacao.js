import React, { useState } from "react";
import { Input, Form, message } from "antd";
import history from "@/history.js";
import { verificaExisteSolicitacao } from "services/ducks/Encantar.ducks";
const { Search } = Input;
const navegarParaSolicitacao = async (idSolicitacao) => {
  if (!idSolicitacao) {
    message.error("Informe o id da solicitação");
    return;
  }
  await verificaExisteSolicitacao(idSolicitacao)
    .then(() => {
      history.push(`/encantar/reacao/${idSolicitacao}`);
    })
    .catch((error) => {
      
      message.error(error);
    });
};

const IrParaSolicitacao = (props) => {
  const [idSolicitacao, setIdSolicitacao] = useState("");

  const onChangeCampoIdSolicitacao = (valorDigitado) => {
    const valorTratado = valorDigitado.replace(/\D/g, "");
    setIdSolicitacao(valorTratado);
  };

  return (
    <Form>
      <Form.Item>
        <Search
          placeholder="Id Solicitação"
          enterButton="Ir Para"
          onChange={(e) => onChangeCampoIdSolicitacao(e.target.value)}
          value={idSolicitacao}
          style={{ width: 320 }}
          onSearch={(idSolicitacao) => navegarParaSolicitacao(idSolicitacao)}
        />
      </Form.Item>
    </Form>
  );
};

export default IrParaSolicitacao;
