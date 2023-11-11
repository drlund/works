import { Tooltip } from 'antd';
import React from 'react';
import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import { AcoesColumn } from './AcoesColumn';

/**
 * @typedef {import('../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion} data
 */

/**
 *
 * Colunas para o caso de procuracoes agregadas
 * @type {{
 *  title: string,
 *  dataIndex: keyof data,
 *  key?: string,
 *  render?: (col: any, record: data, index: number) => React.ReactNode,
 * }[]}
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
    render: (_, { vencimento, revogacao }) => dateToBRTimezoneString(revogacao || vencimento)
  },
  {
    title: 'Manifesto',
    dataIndex: 'manifesto',
    render: (_, { manifesto, revogacao }) => (
      revogacao || manifesto
        ? dateToBRTimezoneString(revogacao || manifesto)
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
 * @type {{
 *  title: string,
 *  dataIndex: keyof data,
 *  key?: string,
 *  render?: (col: any, record: data, index: number) => React.ReactNode,
 * }[]}
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
    render: (_, { vencimento, revogacao }) => dateToBRTimezoneString(revogacao || vencimento)
  },
  {
    title: 'Outorgante',
    // @ts-ignore
    dataIndex: 'nome_completo',
    key: 'nome_completo',
  },
  {
    title: 'Manifesto',
    dataIndex: 'manifesto',
    render: (_, { manifesto, revogacao }) => (
      revogacao || manifesto ? dateToBRTimezoneString(revogacao || manifesto) : null
    )
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
