import React, { useEffect, useState } from 'react';
import RegistroTabela from './Registro/RegistroTabela';
import AccessDenied from 'pages/errors/AccessDenied';
import PageLoading from 'components/pageloading/PageLoading';
import moment from 'moment';
import _ from 'lodash';
import { verifyPermission } from 'utils/Commons';
import { useSelector } from 'react-redux';

const FERRAMENTA = "Designação Interina";

function Registro() {

  const authState = useSelector(({ app }) => app.authState);

  const [permitido, setPermitido] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const permissao = (acesso) => {
      setPermitido(prev => acesso);
    }

    if (_.isNil(permitido)) {
      const acesso = verifyPermission({
          ferramenta: FERRAMENTA,
          permissoesRequeridas: ["ACESSO_TESTE"],
          authState: authState,
        });

        isMounted && permissao(acesso);

    }
    return () => isMounted = false;
  });

  const negado = () => {
    return <AccessDenied />;
  }

  const aceito = () => {
  return <RegistroTabela key={moment().valueOf()} />;
  }

  const loading = () => {
    return <PageLoading />
  }

  const acesso = () => {
    if(!permitido) {
      if (permitido === null) {
        return loading();
      }

      return negado();
    }

    return aceito();
  }

  return acesso();

}

export default React.memo(Registro);