import { useState, useEffect } from 'react';
import { fetchAcesso } from 'pages/painelGestor/apiCalls/Acesso';
export default function usePossuiAcessoPainelGestor() {
  const [possuiAcessoPainelGestor, setPossuiAcessoPainelGestor] =
    useState(null);

  useEffect(() => {
    fetchAcesso().then((isAcesso) => {
      setPossuiAcessoPainelGestor(isAcesso);
    });
  }, []);

  return possuiAcessoPainelGestor;
}
