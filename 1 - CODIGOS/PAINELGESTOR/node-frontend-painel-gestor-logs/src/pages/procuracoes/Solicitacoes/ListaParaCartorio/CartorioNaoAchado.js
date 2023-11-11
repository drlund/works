import { Button, Empty } from 'antd';
import React from 'react';
import { handleCopyToClipboard } from './handleCopyToClipboard';

/**
 * @param {{
 *  cartorioId: string,
 *  data: Procuracoes.SolicitacoesListaCartorio.ListaReturn[number]
 * }} props
 */
export function CartorioNaoAchado({ cartorioId, data }) {
  return (
    <div style={{
      border: '0.2em solid #FF8888',
      borderRadius: '2em',
      padding: '1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    }}>
      <Empty description="Aqui deveria ter um email para o cartório..." />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em'
      }}>
        <Button danger onClick={handleCopyToClipboard(
          `Nome do Cartório de id (${cartorioId}) não encontrado, objeto: (${JSON.stringify(data)})`
        )}>
          Clique aqui para copiar o erro
        </Button>
        <div>Ao acionar a equipe de desenvolvimento, copie o erro e envie</div>
      </div>
    </div>
  );
}
