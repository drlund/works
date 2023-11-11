import { Tooltip } from 'antd';
import React from 'react';
import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import { AcoesColumn } from './AcoesColumn';

/**
 * Colunas para o caso de procuracoes agregadas
 */
export const columnsAgregado = [
  {
    title: 'Funci',
    dataIndex: 'nome',
    key: 'nome'
  },
  {
    title: 'Cargo',
    dataIndex: 'cargo',
    key: 'cargo'
  },
  {
    title: 'Subsidiárias',
    dataIndex: 'subsidiarias',
    key: 'subsidiarias',
    render: (subs) => new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(subs),
  },
  {
    title: 'Vencimento',
    dataIndex: 'vencimento',
    key: 'vencimento',
    render: (_, { vencimento }) => dateToBRTimezoneString(vencimento)
  },
  {
    title: 'Manifesto',
    dataIndex: 'manifesto',
    render: (_, { manifesto }) => (
      manifesto
        ? dateToBRTimezoneString(manifesto)
        : (
          <Tooltip
            title="Procurações particulares não possuem manifesto de assinaturas."
            mouseEnterDelay={1}
          >
            Não se aplica
          </Tooltip>
        )
    ),
  },
  {
    title: 'Ações',
    dataIndex: 'acoes',
    key: 'acoes',
    render: (acoes, record, index) => (
      <AcoesColumn
        acoes={acoes}
        procuracaoId={index === 0 && record.procuracaoId}
        record={record}
      />
    )
  },
];

/**
 * Colunas para o caso de procuracoes diretas de subsidiarias
 */
export const columnsExplodido = [
  {
    title: 'Subsidiária Representada',
    dataIndex: 'nome',
    key: 'nome',
  },
  {
    title: 'Vencimento',
    dataIndex: 'vencimento',
    render: (_, { vencimento }) => dateToBRTimezoneString(vencimento)
  },
  {
    title: 'Outorgante',
    dataIndex: 'nome_completo',
    key: 'nome_completo',
  },
  {
    title: 'Manifesto',
    dataIndex: 'manifesto',
    render: (_, { manifesto }) => (manifesto ? dateToBRTimezoneString(manifesto) : null)
  },
  {
    title: 'Ações',
    dataIndex: 'acoes',
    render: (_, record) => (
      <AcoesColumn
        acoes={[{ [record.nome]: record.doc }]}
        procuracaoId={record.procuracaoId}
        record={record}
      />
    )
  },
];
