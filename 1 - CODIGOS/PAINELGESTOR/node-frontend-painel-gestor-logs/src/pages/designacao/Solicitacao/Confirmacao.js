import React, { useEffect, useCallback, useState } from 'react';

import StyledCard from 'components/styledcard/StyledCard';
import PageLoading from 'components/pageloading/PageLoading';

import FormConfirmacao from './FormConfirmacao';
import TudoOk from './ValidarFunciComp/TudoOk';

function Confirmacao({
  tipo,
  confirmar,
  protocolo,
}) {
  const [thisProtocolo, setThisProtocolo] = useState(null);
  const [isProcessando, setIsProcessando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    render();
  });

  const processando = (estado) => {
    setIsProcessando(estado);
  };

  const thisConfirmar = (protocol, err = null) => {
    const setConfirmacao = (protocoloConfirm, erroConfirm) => {
      if (protocoloConfirm) setThisProtocolo(protocoloConfirm);
      if (erroConfirm) setErro(erroConfirm);
    };

    setConfirmacao(protocol, err);
  };

  const render = useCallback(() => {
    if (isProcessando) {
      return <PageLoading />;
    }

    if (thisProtocolo || erro) {
      return <TudoOk tipo={tipo} protocolo={thisProtocolo} confirmar={confirmar} />;
    }

    return (
      <FormConfirmacao
        confirmar={thisConfirmar}
        processando={processando}
        protocolo={protocolo}
      />
    );
  }, [thisProtocolo, erro, isProcessando, tipo, confirmar, protocolo]);

  return (
    <StyledCard>
      {render()}
    </StyledCard>
  );
}

export default React.memo(Confirmacao);
