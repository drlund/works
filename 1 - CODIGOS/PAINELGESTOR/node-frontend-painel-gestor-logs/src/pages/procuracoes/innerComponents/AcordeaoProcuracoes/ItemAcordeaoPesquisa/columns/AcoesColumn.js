import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

import useToken from 'hooks/useToken';

import { Gerenciar } from './Gerenciar';
import { Historico } from './Historico';
import { PedirRevogacao } from './PedidoRevogacao';
import { RevogacaoParticular } from './RevogacaoParticular';
import { SolicitacoesPesquisa } from './Solicitacoes';
import { SolicitacoesContext } from './shared/SolicitacoesContext';

/**
 * @param {{
 *  acoes: import('../../helpers/extractAcordeaoItemData').ExtractedAcoes,
 *  procuracaoId: number,
 *  record: import('../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function AcoesColumn({ acoes, procuracaoId, record }) {
  const token = useToken();
  return (
    <AcoesColumnWrapper>
      {
        // este map gera os botões para download das procurações
        acoes.map((a) => {
          const [[label, linkKey, href]] = /** @type {[[string, string, string]]} */(
            Object.entries(a).map(([key, value]) => {
              if (typeof value === 'string') {
                return [key, key, value];
              }

              return [value.nome, `${key}${value.nome}`, value.doc];
            })
          );

          return (
            <a
              href={`${href}?token=${token}`}
              key={linkKey}
              target="_blank"
              rel="noreferrer"
              download
            >
              <Button
                size="small"
                icon={<DownloadOutlined />}
              >
                {label}
              </Button>
            </a>
          );
        })
      }
      {Boolean(procuracaoId) && (
        <SolicitacoesContext idProcuracao={procuracaoId}>
          <Historico
            procuracaoId={procuracaoId}
            record={record}
          />
          <Gerenciar
            procuracaoId={procuracaoId}
            record={record}
          />
          <SolicitacoesPesquisa
            procuracaoId={procuracaoId}
            record={record}
          />
          <PedirRevogacao
            procuracaoId={procuracaoId}
            record={record}
          />
          <RevogacaoParticular
            procuracaoId={procuracaoId}
            record={record}
          />
        </SolicitacoesContext>
      )}
    </AcoesColumnWrapper>
  );
}

const AcoesColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
`;
