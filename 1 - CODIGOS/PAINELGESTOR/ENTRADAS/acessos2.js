/**
 * Para verificar se o usuário possui acesso às funções `fetchLogAcessos` e `fetchLogAtualizações`, você pode modificar a função `usePossuiAcessoPainelGestor` 
 * para incluir chamadas a essas funções e, em seguida, retornar um objeto que indique se o usuário tem acesso ou não. Aqui está uma maneira de fazer isso:
 */

/**
 * Com essa modificação, a função `usePossuiAcessoPainelGestor` retornará um objeto que contém informações sobre o acesso do usuário às diferentes funções, 
 * ou seja, `possuiAcessoPainelGestor.acesso`, `possuiAcessoPainelGestor.logAcessos` e `possuiAcessoPainelGestor.logAtualizacoes` indicarão se o usuário possui 
 * acesso ou não a cada uma das funcionalidades.
 */

import { useState, useEffect } from 'react';
import { fetchAcesso, getLogAcessos, getLogAtualizacoes } from 'pages/painelGestor/apiCalls/Acesso';

export default function usePossuiAcessoPainelGestor() {
  const [possuiAcessoPainelGestor, setPossuiAcessoPainelGestor] =
    useState({
      acesso: null,
      logAcessos: null,
      logAtualizacoes: null,
    });

  useEffect(() => {
    // Verifica o acesso geral
    fetchAcesso().then((isAcesso) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        acesso: isAcesso,
      }));
    });

    // Verifica o acesso ao log de acessos
    getLogAcessos().then((isLogAcessos) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        logAcessos: isLogAcessos,
      }));
    });

    // Verifica o acesso ao log de atualizações
    getLogAtualizacoes().then((isLogAtualizacoes) => {
      setPossuiAcessoPainelGestor((prevState) => ({
        ...prevState,
        logAtualizacoes: isLogAtualizacoes,
      }));
    });
  }, []);

  return possuiAcessoPainelGestor;
}
