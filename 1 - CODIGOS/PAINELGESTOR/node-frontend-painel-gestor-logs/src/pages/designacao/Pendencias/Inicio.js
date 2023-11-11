import React, { useEffect, useState } from 'react';

import AccessDenied from 'pages/errors/AccessDenied';

import AbasPendencias from 'pages/designacao/Pendencias/AbasPendencias';

function Pendencia({ acessos }) {
  const [tiposAcessos, setTiposAcessos] = useState(null);

  useEffect(() => {
    if (acessos) {
      setTiposAcessos(acessos.some((elem) => ['ACESSO_TESTE', 'REGISTRO'].includes(elem)));
    }
  }, [acessos]);

  return (
    acessos && tiposAcessos
      ? <AbasPendencias tipoAcesso={acessos} />
      : <AccessDenied />
  );
}

export default React.memo(Pendencia);
