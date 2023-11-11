import { LoadingOutlined } from '@ant-design/icons';
import { Collapse, Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { extractAcordeaoItemData } from '../helpers/extractAcordeaoItemData';
import { PesquisaItemAcordeaoContextWrapper } from './PesquisaItemAcordeaoContext';
import { columnsAgregado, columnsExplodido } from './columns';

const { Text } = Typography;

/**
 * @typedef {Procuracoes.Subsidiaria & { raw: Procuracoes.Procuracao }} SubsidiariaWithProcuracao
 */

/**
 * @param {{
 *  isShowing: boolean,
 *  outorgado: Procuracoes.Outorgante,
 *  props?: unknown
 * }} props
 */
export function ItemAcordeao({ isShowing, outorgado, ...props }) {
  const [{ CollapsePanelHeader, tableDataSource: dataSource }, setTableData] = useState(
    extractAcordeaoItemData(outorgado)
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isShowing || dataSource.length > 0) {
      return;
    }

    setError(false);

    fetch(FETCH_METHODS.GET, '/procuracoes/pesquisa', {
      idProcuracao: outorgado.idProcuracao,
      idProxy: outorgado.idProxy
    })
      .then((resp) => {
        outorgado.procuracao = resp;
        setTableData(extractAcordeaoItemData(outorgado));
      })
      .catch((err) => {
        setError(err);
      });
  }, [isShowing]);

  const ItemWrapper = useCallback(
    /** @param {{ children: React.ReactNode }} props */
    ({ children }) => (
      /**
       * por causa de como o antd está trabalhando com o collapse,
       * o props vem primeio no spread e depois é necessário
       * sobrescrever o header default (na ordem inversa o header fica vazio)
       * @ts-expect-error key é passado dentro de props */
      <Collapse.Panel
        {...props}
        header={CollapsePanelHeader}
      >
        <PesquisaItemAcordeaoContextWrapper outorgado={outorgado}>
          {children}
        </PesquisaItemAcordeaoContextWrapper>
      </Collapse.Panel>
    ),
    [CollapsePanelHeader, props]
  );

  if (error) {
    return (
      <ItemWrapper>
        <Text>{error}</Text>
      </ItemWrapper>
    );
  }

  const semProcuracoes = dataSource.length === 0;
  if (semProcuracoes) {
    return (
      <ItemWrapper>
        <LoadingOutlined />
      </ItemWrapper>
    );
  }

  // caso onde existe apenas uma procuracao significa
  // as procuracoes vem direto das subsidiarias
  const procuracaoDiretoDeSubsidiarias = dataSource.length === 1;
  if (procuracaoDiretoDeSubsidiarias) {
    const procuracaoZero = outorgado.procuracao[0];

    // adiciona as informações da procuracão a cada linha
    // para ser usado no historico
    procuracaoZero.subsidiarias.forEach(
      /** @param {SubsidiariaWithProcuracao} s */
      // @ts-ignore
      (s) => (s.raw = procuracaoZero)
    );

    return (
      <ItemWrapper>
        <Table
          // @ts-ignore
          columns={columnsExplodido}
          dataSource={outorgado.procuracao[0].subsidiarias}
          pagination={false}
          rowKey={(record) => `${record.procuracaoId}`}
        />
      </ItemWrapper>
    );
  }

  return (
    <ItemWrapper>
      <Table
        columns={columnsAgregado}
        dataSource={dataSource}
        pagination={false}
        rowKey={/** @param {ReturnType<import('../helpers/extractAcordeaoItemData').ExtractedDataSource>} record */
          (record) => `${record.matricula}${record.subsIds?.join(',')}${record.procuracaoId}`
        }
      />
    </ItemWrapper>
  );
}

/**
 * @typedef {typeof ItemAcordeao} ItemAcordeaoPesquisa
 */
