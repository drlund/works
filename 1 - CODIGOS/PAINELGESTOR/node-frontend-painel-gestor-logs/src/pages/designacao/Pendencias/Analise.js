import React, { useState } from 'react';
import { getAnalise } from 'services/ducks/Designacao.ducks';
import { Resultado } from 'pages/designacao/Solicitacao/ValidarFunciComp';
import { message } from 'antd';
import useEffectOnce from 'utils/useEffectOnce';
import PageLoading from 'components/pageloading/PageLoading';

function Analise({ id, larger }) {
  const [analise, setAnalise] = useState();

  const mount = () => {
    getAnalise(id)
      .then((thisAnalise) => {
        setAnalise(thisAnalise);
      })
      .catch((error) => {
        message.error(error);
      });
  };

  useEffectOnce(() => {
    mount();
  });

  function render() {
    if (analise) {
      return <Resultado dados={analise} larger={larger} />;
    }

    return <PageLoading />;
  }

  return render();
}

export default React.memo(Analise);
