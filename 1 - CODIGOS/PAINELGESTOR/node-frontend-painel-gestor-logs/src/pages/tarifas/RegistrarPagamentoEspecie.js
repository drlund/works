import React from "react";

import RegistrarPagamento from "./RegistrarPagamento";
import { ESPECIE } from "./constants";
import { getDadosOcorrenciaPgtoEspecie } from "services/ducks/Tarifas.ducks";

const RegistrarPagamentoEspecie = (props) => {
  return (
    <RegistrarPagamento
      getDadosOcorrencia={getDadosOcorrenciaPgtoEspecie}
      tipo={ESPECIE}
      {...props}
    />
  );
};

export default RegistrarPagamentoEspecie;
