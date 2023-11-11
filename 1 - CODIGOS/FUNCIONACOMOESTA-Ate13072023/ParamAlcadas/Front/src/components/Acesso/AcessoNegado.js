import React from 'react';
import { Result, Typography } from 'antd';

function NotFound() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Result status="404" />
      <Typography.Title level={3} type="danger" strong>Página não encontrada</Typography.Title>
    </div>
  );
}

function Forbidden() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Result status="403" />
      <Typography.Title level={3} type="danger" strong>Você não possui acesso a esta ferramenta</Typography.Title>
    </div>
  );
}

/**
 * Componente para informar página não encontrada, acesso negado
 * ou retornar null, não exibindo informação alguma.
 *
 * @param {object} props Props para identificação da página
 * @param {string} props.naoEncontrado Exibe Página não encontrada
 * @param {string} props.naoExibir Não exibe componente, no caso de negado
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
 *   />
 * )
 */

function AcessoNegado({ naoEncontrado, naoExibir }) {
  if (naoEncontrado) {
    return NotFound();
  }

  if (naoExibir) {
    return null;
  }

  return Forbidden();
}

export default AcessoNegado;
