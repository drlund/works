import React, { useEffect, useState } from 'react';
import Principal from 'pages/hrxtra/Acompanhamento/Principal';
import moment from 'moment';
import _ from 'lodash';
import AccessDenied from 'pages/errors/AccessDenied';
import { podeSolicitar } from 'services/ducks/HoraExtra.ducks';

function Acompanhamento(props) {

  const [podeSolicitarHE, setPodeSolicitarHE] = useState(false);

  useEffect(() => {

    const autorizado = (pode) => {
      setPodeSolicitarHE(ant => pode);
    }

    const acessoAutorizado = async () => {
      const pode = await podeSolicitar();

      autorizado(pode);
    }

    acessoAutorizado();

    return () => null;
  });

  return (
    !_.isNull(podeSolicitarHE) ?
      <Principal key={moment().valueOf()} podeSolicitar={podeSolicitarHE} />
      :
      <AccessDenied />
  )
}

export default React.memo(Acompanhamento);
