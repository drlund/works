import React, { useState } from "react";
import { Button, Card, message } from 'antd';
import { patchPessoaComite, deletePessoaComite } from '../internalFunctions/apiCalls';
import { displayDateBR } from "../../../../utils/dateFunctions/displayDateBR";
import { BoldLabelDisplay } from "../../../../components/BoldLabelDisplay/BoldLabelDisplay";
import { handleChangeWithValidations } from "../internalFunctions/handleChangeWithValidations";
import { MesesExpirar } from "./MesesExpirar";

export function PessoaComite({ matricula, nome, dataExpiracao, prefixo, reloadComite }) {
  const [dados, setDados] = useState({ matricula, month: 0 });
  const [sending, setSending] = useState(false);

  const handleChange = handleChangeWithValidations(setDados);

  const handleAlterarClick = () => {
    setSending(true);
    patchPessoaComite({ ...dados })
      .then(() => reloadComite())
      .catch((err) => message.error(`Erro ao alterar pessoa: ${err}`))
      .finally(() => setSending(false));
  };
  const handleDeletarClick = () => {
    setSending(true);
    deletePessoaComite({ ...dados })
      .then(() => reloadComite())
      .catch((err) => message.error(`Erro ao alterar pessoa: ${err}`))
      .finally(() => setSending(false));
  };

  return (
    <Card
      title={<BoldLabelDisplay label="Nome">{nome}</BoldLabelDisplay>}
      actions={[
        <Button
          type="primary"
          onClick={handleAlterarClick}
          disabled={Number(dados.month) === 0}
          loading={sending}
        >
          Alterar
        </Button>,
        <Button
          type="primary"
          onClick={handleDeletarClick}
          loading={sending}
          danger
          ghost
        >
          Excluir
        </Button>
      ]}
      style={{ height: '100%' }}
    >
      <BoldLabelDisplay label="Matricula">{matricula}</BoldLabelDisplay>
      <BoldLabelDisplay label="Data Expiração">{displayDateBR(dataExpiracao)}</BoldLabelDisplay>
      <BoldLabelDisplay label="Prefixo">{prefixo}</BoldLabelDisplay>
      <MesesExpirar
        handleChange={handleChange}
        dados={dados}
        novo />
    </Card>
  );
}
