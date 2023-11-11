import React, { useState } from "react";
import ServerSideTable from "components/serversidetable/ServerSideTable";
import commonColumns from "./commonColumns.js";

const SolicitacoesHistorico = (props) => {

  return (
    <>
      <ServerSideTable
        fetchURL={"/encantar/solicitacoes-finalizadas/"}
        errorMsg="Erro ao recuperar lista de Solicitacoes"
        notFoundMsg="Lista de solicitações finalizadas não foi encontrada"
        columns={[...commonColumns]}
        size="small"
      />
    </>
  );
};

export default SolicitacoesHistorico;
