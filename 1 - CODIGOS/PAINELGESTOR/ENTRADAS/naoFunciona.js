import { useState, useEffect } from 'react';
import {
  fetchAcesso,
  getLogAcessos,
  getLogAtualizacoes,
} from 'pages/painelGestor/apiCalls/Acesso';

export default function usePossuiAcessoPainelGestor() {
  const [possuiAcessoPainelGestor, setPossuiAcessoPainelGestor] = useState({
    acesso: null,
    logAcessos: null,
    logAtulizacoes: null,
  });

  useEffect(() => {
    fetchAcesso().then((isAcesso) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        acesso: isAcesso,
      }));
    });

    getLogAcessos().then((isLogAcessos) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        logAcessos: isLogAcessos,
      }));
    });

    getLogAtualizacoes().then((isLogAtualizacoes) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        logAtulizacoes: isLogAtualizacoes,
      }));
    });
  }, []);

  return possuiAcessoPainelGestor;
}