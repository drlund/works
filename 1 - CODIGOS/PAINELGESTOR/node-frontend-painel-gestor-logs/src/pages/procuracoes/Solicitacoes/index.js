import { Tabs } from 'antd';
import React, { useState } from 'react';

import { PermissionGuard } from '@/components/PermissionGuard';
import { SpinningContext } from '@/components/SpinningContext';

import { CartorioContext } from '../contexts/CartorioContext';
import { useProcuracoesSolicitacoes } from '../hooks/useProcuracoesSolicitacoes';
import { ListaControleEnvios } from './ListaControleEnvios';
import { ListaParaCartorio } from './ListaParaCartorio';
import { ListaSolicitacoes } from './ListaSolicitacoes';
import { RevogacaoMassificada } from './RevogacaoMassificada';

function Solicitacoes() {
  const hasSolicitacoesPermission = useProcuracoesSolicitacoes();
  const [activeKey, setActiveKey] = useState(
    /** @type {typeof items[number]['key']} */('solicitacoes')
  );

  const items = /** @type {const} */([
    {
      label: 'Solicitações Pendentes de Confirmação',
      key: 'solicitacoes',
      children: (
        <SpinningContext>
          <ListaSolicitacoes />
        </SpinningContext>
      )
    },
    {
      label: 'Solicitações a Serem Enviadas',
      key: 'cartorio',
      children: (
        <SpinningContext>
          <ListaParaCartorio />
        </SpinningContext>
      )
    },
    {
      label: 'Controle de Items Enviados',
      key: 'controle',
      children: (
        <SpinningContext>
          <ListaControleEnvios />
        </SpinningContext>
      )
    },
    {
      label: 'Revogação Massificada',
      key: 'revogacao',
      children: (
        <SpinningContext>
          <RevogacaoMassificada />
        </SpinningContext>
      )
    }
  ]);

  /**
   * @param {typeof activeKey} key
   * isso muda a `key`, o que força o tabs a renderizar
   * isso força os tabs a buscar os dados atualizados
   * a cada visita na tab
   *
   * importante no caso de confirmar uma solicitação
   * depois de já ter visitado o que tem em
   */
  const handleChange = (key) => {
    setActiveKey(key);
  };

  return (
    <PermissionGuard
      guard={hasSolicitacoesPermission}
    >
      <CartorioContext>
        <Tabs
          // @ts-expect-error not `Tab[]`
          items={items}
          size='large'
          key={activeKey}
          // @ts-expect-error string not `typeof activeKey`
          onChange={handleChange}
          defaultActiveKey={activeKey}
          style={{ marginBottom: '4em' }}
        />
      </CartorioContext>
    </PermissionGuard>
  );
}

export default Solicitacoes;
