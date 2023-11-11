import { Collapse, Empty, message } from 'antd';
import { useEffect, useState } from 'react';

import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

import { AcordeaoListaMinutasMassificado } from './AcordeaoListaMinutasMassificado';
import { ListaMassificadoItemHeader } from './ListaMassificadoItemHeader';

/**
 * @typedef {{
 *  idMinuta: string;
 *  idMassificado: string;
 *  idFluxo: string;
 *  matriculaOutorgado: string;
 *  nomeOutorgado: string;
 *  prefixoOutorgado: string;
 *  createdAt: Date;
 *  ativos: number;
 *  total: number;
 * }} ItemListaMassificados
 *
 * @typedef {Pick<
 *  ItemListaMassificados,
 *  'idMinuta'|'matriculaOutorgado'|'nomeOutorgado'|'prefixoOutorgado'|'createdAt'
 * >} ItemFunciMassificado
 *
 * @typedef {{
 *  idMassificado: string;
 *  idFluxo: string;
 *  ativos: number;
 *  total: number;
 *  outorgados: ItemFunciMassificado[];
 * }} ItemMassificadoGroup
 */

export function ListaDeMassificado() {
  const [lista, setLista] = useState(/** @type {false|ItemListaMassificados[]} */(false));
  const [error, setError] = useState(/** @type {false|{message: string}} */(false));

  const items = (Array.isArray(lista) && lista.length > 0)
    ? lista.reduce((acc, cur) => {
      if (acc.map[cur.idMassificado] === undefined) {
        const pushed = acc.arr.push({
          ativos: cur.ativos,
          total: cur.total,
          idMassificado: cur.idMassificado,
          idFluxo: cur.idFluxo,
          outorgados: [{
            createdAt: cur.createdAt,
            idMinuta: cur.idMinuta,
            matriculaOutorgado: cur.matriculaOutorgado,
            nomeOutorgado: cur.nomeOutorgado,
            prefixoOutorgado: cur.prefixoOutorgado,
          }]
        });

        // push retorna length do array após push
        // então usamos isso para poder saber exatamente
        // a posição do elemento nas outras iterações
        acc.map[cur.idMassificado] = pushed - 1;
      } else {
        acc.arr[acc.map[cur.idMassificado]].outorgados.push({
          createdAt: cur.createdAt,
          idMinuta: cur.idMinuta,
          matriculaOutorgado: cur.matriculaOutorgado,
          nomeOutorgado: cur.nomeOutorgado,
          prefixoOutorgado: cur.prefixoOutorgado,
        });
      }

      return acc;
    }, /** @type {{ map: Record<string, number>, arr: ItemMassificadoGroup[] }} */({
      arr: [],
      map: {},
    })).arr
    : false;

  useEffect(() => {
    fetch(FETCH_METHODS.GET, 'procuracoes/massificado/minuta')
      .then(setLista)
      .catch((err) => setError({ message: JSON.stringify(err) }));
  }, []);

  if (error) {
    return <Empty description={`Erro ao carregar lista de massificados: ${error.message}`} />;
  }

  if (!lista || !items || items.length === 0) {
    return <Empty description={lista === false ? 'Carregando lista de massificados' : "Nenhum massificado em aberto."} />;
  }

  return (
    <Collapse accordion key={lista.length}>{
      items.map((item) => (
        // @ts-expect-error error do props
        <ListaMassificadoItem key={`${lista.length}${item.idMassificado}`} item={item} />
      ))
    }</Collapse >
  );
}

/**
 * @param {{
 *  item: ItemMassificadoGroup,
 *  props: unknown,
 * }} props
 */
function ListaMassificadoItem({ item, ...props }) {
  const [minutasSelected, setMinutasSelected] = useState(/** @type {string[]} */(null));
  const [deleted, setDeleted] = useState(/** @type {string[]} */([]));
  const historyPush = useHistoryPushWithQuery();

  const outorgadosFiltrado = item
    .outorgados
    .filter(o => !deleted.includes(o.idMinuta));

  // se nada foi alterado, usar todos
  const lista = minutasSelected ?? outorgadosFiltrado.map(o => o.idMinuta);

  const handleGerar = (/** @type {React.MouseEvent<HTMLElement, MouseEvent>} */e) => {
    e.stopPropagation();

    if (minutasSelected) {
      // salvando a lista do que foi marcado para gerar apenas isso
      // o padrão vai ser fazer tudo de outra forma
      window.sessionStorage.setItem(`listaMinutas-${item.idMassificado}`, JSON.stringify(lista));
    }

    historyPush(`/procuracoes/massificado/minuta/${item.idMassificado}`);
  };
  const handleDeletar = (/** @type {React.MouseEvent<HTMLElement, MouseEvent>} */e) => {
    e.stopPropagation();

    // o generic fetch transforma os params em query params
    // no entanto com menos de 200 minutas já estourou o limite de url
    // então passando como`data`, o axios envia como payload a lista e evita o erro
    fetch(FETCH_METHODS.DELETE,
      `procuracoes/massificado/listaMinutas`,
      undefined,
      undefined,
      undefined,
      {
        data: {
          listaDeMinutas: lista
        }
      })
      .then(() => {
        setDeleted(old => [...old, ...lista]);
        setMinutasSelected(null);
        message.success(`${lista.length} minutas deletadas`);
      })
      .catch((err) => {
        message.error(JSON.stringify(err));
      });
  };

  return (
    // @ts-expect-error key é passada pelo props (não funciona sem o spread)
    <Collapse.Panel
      {...props}
      header={
        outorgadosFiltrado.length > 0
          ? (
            <ListaMassificadoItemHeader
              ativos={outorgadosFiltrado.length}
              item={item}
              handleGerar={handleGerar}
              handleDeletar={handleDeletar}
              minutasSelected={minutasSelected ? lista.length : -1}
            />
          )
          : 'Massificado Deletado'
      }
      collapsible={outorgadosFiltrado.length === 0 ? 'disabled' : undefined}
      style={{ pointerEvents: outorgadosFiltrado.length === 0 ? 'none' : undefined }}
    >
      {outorgadosFiltrado.length > 0
        ? (
          <AcordeaoListaMinutasMassificado
            key={outorgadosFiltrado.length}
            outorgados={outorgadosFiltrado}
            setSelected={setMinutasSelected}
          />
        ) : null
      }
    </Collapse.Panel>
  );
}
