import React from "react";
import FormAprovacao from "./FormAprovacao";
import constants from "../../../utils/Constants";
import { Alert, Typography } from "antd";
const { Text } = Typography;
const { ENCANTAR } = constants;
/**
 *
 *   Componente que irá mostrar o formulário para aprovação, no caso do usuário logado estiver lotado no fluxo atual,  ou dados do fluxo atual caso contrário
 *
 */

const AreaFormAprovacao = (props) => {
  const { reloadAprovacao, solicitacao } = props;
  const { fluxoAtual } = solicitacao;
  const possuiSolicitacoesAnteriores =
    solicitacao.dadosCliente.solicitacoesAnteriores &&
    solicitacao.dadosCliente.solicitacoesAnteriores.length > 0;

  if (solicitacao.status.id !== ENCANTAR.PENDENTE_DEFERIMENTO) {
    return <p> Aprovação finalizada </p>;
  }

  return (
    <>
      {possuiSolicitacoesAnteriores && (
        <Alert
          message="Atenção! Este cliente já incluído em ações anteriores. Caso queira consultá-las, acesse a aba Dados Cliente"
          type="warning"
        />
      )}
      {solicitacao.usuarioComPermissaoNoFluxoAtual ? (
        <FormAprovacao
          reloadAprovacao={reloadAprovacao}
          idSolicitacao={solicitacao}
        />
      ) : (
        <Alert
          message={
            <Text>
              Aprovação pendente no prefixo{" "}
              <Text strong>
                {" "}
                {fluxoAtual.prefixoAutorizador} -{" "}
                {fluxoAtual.nomePrefixoAutorizador}
              </Text>
            </Text>
          }
        />
      )}
    </>
  );
};

export default AreaFormAprovacao;
