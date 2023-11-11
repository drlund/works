import React, { useEffect, useState } from 'react';
import 'moment/locale/pt-br';
import { getDadosSolicitacaoHE } from 'services/ducks/HoraExtra.ducks';
import AccessDenied from 'pages/errors/AccessDenied';
import SolicitacaoUN from 'pages/hrxtra/NovaSolicitacao/SolicitacaoUN';
import { message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import PageLoading from 'components/pageloading/PageLoading';

function NovaSolicitacao (props) {

  const [prefixo, setPrefixo] = useState(null);
  const [subordinadas, setSubordinadas] = useState(null);
  const [user, setUser] = useState(null);
  const [dotacao, setDotacao] = useState(null);
  const [podeAcessar, setPodeAcessar] = useState(null);

  useEffect(() => {
    let isMounted = true;

    isMounted &&
      getDadosSolicitacaoHE()
        .then(dados => {
          if (isMounted) {
            if (dados.podeAcessar) {
              setUser(prev => dados.user);
              setPrefixo(prev => dados.prefixo);
              setSubordinadas(prev => dados.subordinadas);
              setDotacao(prev => dados.dotacao);
            }

            setPodeAcessar(prev => dados.podeAcessar);
          }
        })
        .catch(error => message.error(error));

    return () => {
      setPodeAcessar(null);
      isMounted = false;
    }
  }, [setUser, setPrefixo, setSubordinadas, setDotacao, setPodeAcessar]);

  const pagina = () => {
    if (_.isNil(podeAcessar)) return <PageLoading />
    if (podeAcessar) return <SolicitacaoUN key={moment().valueOf()} dados={{user, prefixo, subordinadas, dotacao}} />
    return <AccessDenied />
  }

  return (pagina());
}

export default React.memo(NovaSolicitacao);