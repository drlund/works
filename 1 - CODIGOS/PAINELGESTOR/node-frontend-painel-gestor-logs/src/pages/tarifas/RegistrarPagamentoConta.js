import React from "react";
import RegistrarPagamento from "./RegistrarPagamento";
import { CONTA_CORRENTE } from "./constants";
import { getDadosOcorrenciaPgtoConta } from "services/ducks/Tarifas.ducks";

const RegistrarPagamentoConta = (props) => {
  return (
    <RegistrarPagamento
      getDadosOcorrencia={getDadosOcorrenciaPgtoConta}
      tipo={CONTA_CORRENTE}
      {...props}
    />
  );
};

export default RegistrarPagamentoConta;
