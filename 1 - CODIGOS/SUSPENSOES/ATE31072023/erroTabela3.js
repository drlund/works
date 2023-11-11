/**
 * Adicionando o código completo com a utilização do `useEffect` corrigido. Lembre-se de substituir o trecho relevante do seu código existente pelo novo código abaixo:
 */

/**
 * Lembre-se de que esse código assume que o objeto retornado por `getSuspensoes(id)` tem a estrutura correta com os dados que você precisa exibir na tabela. Caso 
 * contrário, você pode precisar fazer ajustes adicionais para transformar os dados adequadamente antes de usá-los na tabela.
 * 
 * Com essa correção, o `useEffect` deverá buscar os dados corretamente e atualizar o estado `suspensoes` como um array, permitindo que o método `map` funcione como esperado. 
 */


import React, { useState, useEffect } from 'react';
// ... (importações restantes)

function ParamSuspensaoTable({ ...props }) {
  // Código existente...

  const [suspensoes, setSuspensoes] = useState([]);

  // Restante do código existente...

  useEffect(() => {
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      setFetching(true);
      Promise.all([obterSuspensoes(), getSuspensoes(id)])
        .then(([obterResult, getSuspensoesResult]) => {
          // Convertendo o objeto retornado para um array de valores
          setSuspensoes(Object.values(getSuspensoesResult));
        })
        .catch(() => 'Erro ao obter suspensões!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  // Restante do código existente...

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      {/* Restante do código existente... */}
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamSuspensaoTable);
