import { LoadingOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Collapse, Typography
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';
import { dateToBRTimezoneString } from 'utils/dateToBRTimezoneString';
import { getSmallerDateFromSubsidiarias } from '../helpers/smallerDateFunctions';
import { getRevogadoInativoColor } from '../helpers/getRevogadoInativoColor';

const { Text } = Typography;

export const ItemAcordeao =
  /**
   * @param {(outorgante: Procuracoes.OutorganteSelecionado) => void} selectOutorgante
   * @param {Procuracoes.OutorganteSelecionado} poderes
   */
  (selectOutorgante, poderes) =>
    /**
     * @param {{
     *  isShowing: boolean,
     *  outorgado: Procuracoes.Outorgante,
     *  props?: unknown
     * }} props
     */
    ({ isShowing, outorgado, ...props }) => {
      const [dataSource, setDataSource] = useState(outorgado);
      const [subsidiariasSelected, setSubsidiariasSelected] = useState(
        poderes?.subsidiariasSelected || null
      );
      const [error, setError] = useState(false);

      const {
        ativo, idProcuracao, idProxy, matricula, nome
      } = dataSource;

      const subsidiarias = dataSource.procuracao?.[0]?.subsidiarias;

      const vencimentoGeral = useMemo(() => (() => {
        try {
          return dataSource.procuracao[0].procuracaoAgregada?.revogacao
            || dataSource.procuracao[0].procuracaoAgregada?.vencimento
            || getSmallerDateFromSubsidiarias(dataSource.procuracao[0].subsidiarias, 'revogacao')
            || getSmallerDateFromSubsidiarias(dataSource.procuracao[0].subsidiarias);
        } catch (_) {
          return null;
        }
      })(), [props]);

      const isRevogado = useMemo(() => (() => {
        try {
          return Boolean(dataSource.procuracao[0].procuracaoAgregada?.revogacao
            || dataSource.procuracao[0].subsidiarias
              .some(s => Boolean(s.revogacao)));
        } catch (_) {
          return false;
        }
      })(), [props]);

      const options = subsidiarias?.reduce((acc, cur) => {
        if (!acc.ids[cur.id]) {
          const label = cur.revogacao || cur.vencimento
            ? `${cur.nome} (${dateToBRTimezoneString(cur.revogacao || cur.vencimento)})`
            : `${cur.nome} (${dateToBRTimezoneString(vencimentoGeral)})`;
          acc.arr.push({ label, value: cur.id });
          acc.ids[cur.id] = cur.id;
        }

        return acc;
      },
        /**
         * @type {{
         *  arr: {
         *    label: string,
         *    value: number,
         *  }[],
         *  ids: {
         *    [x: number]: number
         *  }
         * }}
         */
        ({
          arr: [],
          ids: {},
        })).arr;
      const defaultOptions = options?.map((o) => o.value);

      const isSelected = (
        poderes?.idProcuracao === idProcuracao
        && poderes?.idProxy === idProxy
      );

      useEffect(() => {
        if (!isShowing || dataSource.procuracao?.length > 0) {
          return;
        }

        setError(false);

        fetch(FETCH_METHODS.GET, '/procuracoes/pesquisa', {
          idProcuracao: outorgado.idProcuracao,
          idProxy: outorgado.idProxy
        })
          .then((resp) => {
            outorgado.procuracao = resp;
            setDataSource((old) => ({ ...old, procuracao: resp }));
          })
          .catch((err) => {
            setError(err);
          });
      }, [isShowing, outorgado]);

      useEffect(() => {
        if (defaultOptions && subsidiariasSelected === null) {
          setSubsidiariasSelected(defaultOptions);
        }
      }, [defaultOptions]);

      const ItemWrapper = useCallback(
        /** @param {{ children: React.ReactNode }} props */
        ({ children }) => {
          const makeTextHeader = () => {
            if (isRevogado) {
              return 'Esta Procuração foi Revogada';
            }

            if (!ativo) {
              return 'Procuração Inativa';
            }

            if (vencimentoGeral) {
              return `Vencimento: ${dateToBRTimezoneString(vencimentoGeral)}`;
            }
            return 'Abra este item para consultar o vencimento';
          };

          return (
            /**
             * por causa de como o antd está trabalhando com o collapse,
             * o props vem primeio no spread e depois é necessário
             * sobrescrever o header default (na ordem inversa o header fica vazio)
             * @ts-expect-error key é passado dentro de props */
            <Collapse.Panel
              {...props}
              style={{ backgroundColor: getRevogadoInativoColor({ revogado: isRevogado, ativo: outorgado.ativo }) }}
              header={(
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    {dataSource.matricula.trim()}
                    {' '}
                    -
                    {' '}
                    {dataSource.nome.trim()}
                    {' '}
                    (
                    {dataSource.cargoNome.trim()}
                    )
                  </span>
                  <div>{makeTextHeader()}</div>
                </div>
              )}
            >
              {children}
            </Collapse.Panel>
          );
        },
        [props]
      );

      const handleClick = () => {
        if (isSelected) {
          selectOutorgante(null);
        } else {
          selectOutorgante(/** @type {Procuracoes.OutorganteSelecionado} */({
            matricula,
            nome,
            idProcuracao,
            idProxy,
            subsidiariasSelected
          }));
        }
      };

      if (error) {
        return (
          <ItemWrapper>
            <Text>{error}</Text>
          </ItemWrapper>
        );
      }

      const semProcuracoes = dataSource.procuracao === undefined || dataSource.procuracao.length === 0;
      if (semProcuracoes) {
        return (
          <ItemWrapper>
            <LoadingOutlined />
          </ItemWrapper>
        );
      }

      return (
        <ItemWrapper>
          <Button
            onClick={handleClick}
            disabled={!subsidiariasSelected || subsidiariasSelected.length === 0}
            style={{ marginRight: '2em' }}
          >
            {isSelected ? 'Desmarcar' : 'Confirmar Seleção'}
          </Button>
          <Checkbox.Group
            options={options}
            value={subsidiariasSelected}
            // @ts-ignore
            onChange={setSubsidiariasSelected}
            disabled={isSelected}
          />
        </ItemWrapper>
      );
    };

/**
 * @typedef {typeof ItemAcordeao} ItemAcordeaoCadastro
 */
