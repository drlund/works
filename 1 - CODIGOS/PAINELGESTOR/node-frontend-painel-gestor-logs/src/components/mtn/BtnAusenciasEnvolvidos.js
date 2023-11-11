import React from "react";
import BtnAusenciasFunci from "components/BtnAusenciasFunci/BtnAusenciasFunci";
import { fetchAusenciasFunci } from "services/ducks/Mtn.ducks";
import moment from "moment";

const BtnAusenciasEnvolvidos = (props) => {
  const { envolvido } = props;
  const dataCriacao = moment(envolvido.criadoEm, "DD/MM/YYYY hh:mm");
  const dataAtual = moment();

  return (
    <BtnAusenciasFunci
      disableMatricula={true}
      defaultMatricula={envolvido.matricula}
      defaultPeriodo={[dataCriacao, dataAtual]}
      fetchAusenciasFunci={fetchAusenciasFunci}
    />
  );
};

export default BtnAusenciasEnvolvidos;
