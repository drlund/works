import {
  AuditOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  ImportOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import React from 'react';

import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';

import './Funcionalidades.scss';
import { useProcuracoesMassificado } from '../hooks/useProcuracoesMassificado';
import { useProcuracoesSolicitacoes } from '../hooks/useProcuracoesSolicitacoes';

const useFuncionalidades = () => {
  const massificadoPermission = useProcuracoesMassificado();
  const solicitacoesPermission = useProcuracoesSolicitacoes();

  return [
    {
      title: 'Emitir uma Minuta',
      link: 'minuta',
      icon: () => <FileDoneOutlined className="icon" />,
    },
    {
      title: 'Cadastrar uma Procuração',
      link: 'cadastrar',
      icon: () => <FileAddOutlined className="icon" />,
    },
    {
      title: 'Pesquisar Procurações',
      link: 'pesquisar',
      icon: () => <FileSearchOutlined className="icon" />,
    },
    {
      title: 'Gestão de Procurações',
      link: 'gestao',
      disabled: true,
      icon: () => <AuditOutlined className="icon" />,
    },
    {
      flag: solicitacoesPermission,
      title: 'Solicitações',
      link: 'solicitacoes',
      icon: () => <ImportOutlined className="icon" />,
    },
    {
      flag: massificadoPermission,
      title: 'Massificado',
      link: 'massificado',
      icon: () => <UnorderedListOutlined className="icon" />,
    },
  ];
};

const Funcionalidades = () => {
  const historyPush = useHistoryPushWithQuery();

  return (
    <Card title={<Typography.Title level={2}>Aqui você pode</Typography.Title>}>
      <div className="wrapperFuncionalidades">
        {useFuncionalidades()
          .filter(f => f.flag === undefined ? true : f.flag)
          .map((funcionalidade) => (
            <Button
              // @ts-ignore
              type="button"
              key={funcionalidade.link}
              onClick={() => historyPush(`/procuracoes/${funcionalidade.link}`)}
              className="funcionalidade"
              disabled={funcionalidade.disabled}
            >
              <div>{funcionalidade.icon()}</div>
              <div>{funcionalidade.title}</div>
            </Button>
          ))}
      </div>
    </Card>
  );
};

export default Funcionalidades;
