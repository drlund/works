import React from 'react';
import { useSelector } from 'react-redux';
import { verifyPermission } from 'utils/Commons';

import AcessoNegado from './AcessoNegado';

/**
 * Componente para verificar o acesso do funcionário
 * a determinada ferramenta, usando o Acesso do v8
 * Exibe Página de Acesso Negado caso as props
 * naoEncontrado e naoExibir não sejam setadas.
 *
 * @param {object} props Props para verificar acesso
 * @param {string} props.ferramenta Nome da ferramenta como cadastrado no Acesso v8
 * @param {Array} props.listaAcessos Lista de strings contendo os acessos para consulta
 * @param {React.Component} props.componente Componente a ser carregado caso acesso aprovado
 * @param {boolean} props.naoEncontrado Exibir Página Não Encontrada
 * @param {boolean} props.naoExibir Não exibir componentes.
 *
 * @component
 * @example
 * const ferramenta = 'Acesso Temporário'
 * const listaAcessos = ['Acesso Admin',  'Acesso Usuário Comum']
 * const componente = <Componente />
 * return (
 *   <Acesso
 *     ferramenta={ferramenta}
 *     listaAcessos={listaAcessos}
 *     componente={componente}
 *     naoEncontrado
 *     naoExibir
 *   />
 * )
 */
function Acesso(props) {
  const {
    ferramenta,
    listaAcessos,
    componente,
    naoEncontrado,
    naoExibir
  } = props;
  const authState = useSelector(({ app }) => app.authState);

  const acesso = verifyPermission({
    ferramenta,
    permissoesRequeridas: [...listaAcessos],
    authState,
  });

  if (acesso) {
    return (
      componente
    );
  }

  return (
    <AcessoNegado
      proibido={!(naoEncontrado || naoExibir)}
      naoEncontrado={naoEncontrado}
      naoExibir={naoExibir}
    />
  );
}

export default Acesso;
