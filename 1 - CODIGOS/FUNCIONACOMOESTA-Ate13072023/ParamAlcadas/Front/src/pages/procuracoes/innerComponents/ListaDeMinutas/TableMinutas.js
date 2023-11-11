import {
  Button, message, Popconfirm, Space, Table, Tooltip
} from 'antd';
import React, { useState } from 'react';

import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';
import { useProcuracoesDeletarMinutasPermission } from 'pages/procuracoes/hooks/useProcuracoesDeletarMinutasPermission';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';


const columns = /** @type {const} */ ([
  ['ID Minuta', 'idMinuta', 'idMinuta', true, '10%'],
  ['Data', 'data', 'data', false, '10%'],
  ['Outorgado', 'outorgado', 'outorgado', false, '20%'],
  ['Tipo de Minuta', 'tipoMinuta', 'tipoMinuta', false, '35%'],
  ['Ações', 'acoes', 'acoes', false, '25%'],
]).map(
  ([title, dataIndex, key, ellipsis, width]) => ({
    title, dataIndex, key, ellipsis, width
  })
);

/**
 * @param {{
 *  error: string,
 *  source?: never,
 *  fluxos?: never
 *  showMassificado?: never,
 * }|{
 *  error?: never,
 *  source: import('./useListaMinutasCall').MinutaLista,
 *  fluxos: Procuracoes.Fluxos,
 *  showMassificado: boolean,
 * }} props
 */
export const TableMinutas = ({ source, error, fluxos, showMassificado }) => {
  const [deleted, setDeleted] = useState(/** @type {string[]} */([]));
  const hasDeletarPermission = useProcuracoesDeletarMinutasPermission();
  const historyPush = useHistoryPushWithQuery();

  if (error) {
    return (
      <Table
        dataSource={[{ error }]}
        columns={[
          {
            title: 'Erro',
            dataIndex: 'error',
            key: 'error'
          }
        ]}
        rowKey="error"
        pagination={false}
      />
    );
  }

  /** @param {string} id */
  const handleDelete = (id) => {
    setDeleted((old) => {
      old.push(id);
      return [...old];
    });

    fetch(FETCH_METHODS.DELETE, `/procuracoes/minutas/${id}`)
      .then(() => {
        message.success('Minuta deletada com sucesso!');
      })
      .catch((err) => {
        setDeleted((old) => old.filter((d) => d !== id));
        message.error(err);
      });
  };

  const dataSource = source
    ?.filter(({ idMinuta, idMassificado }) => {
      const massificadoFilter = showMassificado ? true : !idMassificado;

      return !deleted.includes(idMinuta) && massificadoFilter;
    })
    .map(({
      idMinuta, idFluxo, idMassificado, createdAt, outorgado: {
        matricula, nome,
      }
    }) => ({
      idMinuta: showMassificado && Boolean(idMassificado)
        ? (<div>
          <strong>Massificado</strong>
          <div>{idMinuta}</div>
        </div>)
        : idMinuta,
      key: idMinuta,
      data: createdAt,
      outorgado: `${matricula} ${nome}`,
      tipoMinuta: fluxos[idFluxo].minuta,
      acoes: (
        <Space wrap>
          <Button
            onClick={() => historyPush(`/procuracoes/cadastrar/${idMinuta}`)}
            size="small"
            type="primary"
          >
            Cadastrar Procuração
          </Button>
          <Button
            onClick={() => historyPush(`/procuracoes/minuta/${idMinuta}`)}
            size="small"
            type="default"
          >
            Baixar Novamente
          </Button>
          {hasDeletarPermission ? (
            <Popconfirm
              title="Tem certeza que quer deletar? (Ação não pode ser desfeita.)"
              onConfirm={() => handleDelete(idMinuta)}
              okText="Confirmar"
              cancelText="Cancelar"
            >
              <Button
                danger
                size="small"
                type="dashed"
              >
                Excluir
              </Button>
            </Popconfirm>
          ) : (
            <Tooltip title="Entre em contato com a Super para excluir uma minuta.">
              <Button
                danger
                size="small"
                type="dashed"
                disabled
              >
                Excluir
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey={({ key }) => key}
    />
  );
};
