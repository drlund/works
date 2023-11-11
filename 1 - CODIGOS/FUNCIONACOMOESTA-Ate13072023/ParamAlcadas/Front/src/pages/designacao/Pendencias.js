import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { verifyPermission } from 'utils/Commons';

import Inicio from 'pages/designacao/Pendencias/Inicio';

const FERRAMENTA = 'Designação Interina';

function Pendencias() {
  const authState = useSelector(({ app }) => app.authState);

  const acessos = useMemo(() => [
    'REGISTRO',
    'SUPERADM',
    'DIPES',
    'DIVAR',
    'DIRAV',
    'GEPES',
    'AGENCIAS',
    'OUTROS',
    'ACESSO_TESTE',
    'ACESSO_ORIGEM',
  ].filter((elem) => verifyPermission({
    ferramenta: FERRAMENTA,
    permissoesRequeridas: [elem],
    authState,
  })), [authState]);

  return <Inicio key={moment().valueOf()} acessos={acessos} />;
}

export default Pendencias;
