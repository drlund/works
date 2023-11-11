import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useToken from 'hooks/useToken';
import React from 'react';
import styled from 'styled-components';
import { Gerenciar } from './Gerenciar';
import { Historico } from './Historico';

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
          /** @type {[string, string, string][]} */
          const [[label, linkKey, href]] = Object.entries(a).map(([key, value]) => {
            if (typeof value === 'string') {
              return [key, key, value];
            }
            return [value.nome, `${key}${value.nome}`, value.doc];
          }, []);

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
        <>
          <Historico
            procuracaoId={procuracaoId}
            record={record}
          />
          <Gerenciar
            procuracaoId={procuracaoId}
            record={record}
          />
        </>
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
