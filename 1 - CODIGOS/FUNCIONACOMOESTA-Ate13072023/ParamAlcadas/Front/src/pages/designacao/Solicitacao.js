import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { verifyPermission } from 'utils/Commons';

import AccessDenied from 'pages/errors/AccessDenied';
import PageLoading from 'components/pageloading/PageLoading';

import SolicitacaO from 'pages/designacao/Solicitacao/Solicitacao';

const FERRAMENTA = 'Designação Interina';

function Solicitacao() {
  const authState = useSelector(({ app }) => app.authState);

  const [permitido, setPermitido] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const permissao = (acesso) => {
      setPermitido(acesso);
    };

    if (_.isNil(permitido)) {
      const acesso = verifyPermission({
        ferramenta: FERRAMENTA,
        permissoesRequeridas: ['ACESSO_TESTE'],
        authState,
      });

      if (isMounted) {
        permissao(acesso);
      }
    }

    return () => {
      isMounted = false;
    };
  });

  if (permitido === null) return <PageLoading />;

  if (!permitido) return <AccessDenied />;

  return <SolicitacaO />;
}

export default React.memo(Solicitacao);
