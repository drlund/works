/**
 * Para verificar se o usuário possui acesso às funções `fetchLogAcessos` e `fetchLogAtualizações`, você pode fazer uma chamada condicional dentro da função 
 * `usePossuiAcessoPainelGestor` logo após a chamada de `fetchAcesso`. Algo assim:
 */

/**
 * Dentro da função `useEffect`, você pode realizar as verificações de acesso às funções `fetchLogAcessos` e `fetchLogAtualizações` com base na variável `isAcesso`, 
 * que parece ser o resultado da função `fetchAcesso`. Implemente a lógica apropriada para determinar se o usuário possui acesso a essas funções e armazene essa 
 * informação em variáveis, como `temAcessoLogAcessos` e `temAcessoLogAtualizacoes`, que você pode usar posteriormente conforme necessário.
 */

import { useState, useEffect } from 'react';
import { fetchAcesso, fetchLogAcessos, fetchLogAtualizações } from 'pages/painelGestor/apiCalls/Acesso';

export default function usePossuiAcessoPainelGestor() {
  const [possuiAcessoPainelGestor, setPossuiAcessoPainelGestor] =
    useState(null);

  useEffect(() => {
    fetchAcesso().then((isAcesso) => {
      setPossuiAcessoPainelGestor(isAcesso);

      // Verifique o acesso a fetchLogAcessos e fetchLogAtualizações aqui
      if (isAcesso) {
        const temAcessoLogAcessos = /* Verifique o acesso aqui */;
        const temAcessoLogAtualizacoes = /* Verifique o acesso aqui */;

        // Faça algo com as variáveis temAcessoLogAcessos e temAcessoLogAtualizacoes
      }
    });
  }, []);

  return possuiAcessoPainelGestor;
}
