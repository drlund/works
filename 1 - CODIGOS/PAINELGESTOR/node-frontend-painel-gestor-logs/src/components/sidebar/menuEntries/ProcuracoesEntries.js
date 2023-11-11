import { BookOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

import { useProcuracoesSolicitacoes } from '@/pages/procuracoes/hooks/useProcuracoesSolicitacoes';
import { useProcuracoesMassificado } from 'pages/procuracoes/hooks/useProcuracoesMassificado';
import { LinkWithLocation } from '@/components/LinkWithLocation';

function ProcuracoesEntries({
  // @ts-ignore
  authState,
  // @ts-ignore
  toggleSideBar,
  // @ts-ignore
  isFullScreenMode,
  // @ts-ignore
  sideBarCollapsed,
  // @ts-ignore
  warnKey,
  ...subMenuProps
}) {
  const massificadoPermission = useProcuracoesMassificado();
  const solicitacoesPermission = useProcuracoesSolicitacoes();

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="procuracoes"
      title={(
        <span>
          <BookOutlined />
          <span>Procurações</span>
        </span>
      )}
    >
      {/* @ts-ignore */}
      <Menu.Item key="Home">
        <LinkWithLocation to="/procuracoes/">Home</LinkWithLocation>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Minuta">
        <LinkWithLocation to="/procuracoes/minuta">Minuta</LinkWithLocation>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Cadastrar">
        <LinkWithLocation to="/procuracoes/cadastrar">Cadastrar</LinkWithLocation>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Pesquisar">
        <LinkWithLocation to="/procuracoes/pesquisar">Pesquisar</LinkWithLocation>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item disabled key="Gestão">
        <LinkWithLocation to="/procuracoes/gestao">Gestão</LinkWithLocation>
      </Menu.Item>
      {solicitacoesPermission && (
        // @ts-ignore
        <Menu.Item key="Solicitações">
          <LinkWithLocation to="/procuracoes/solicitacoes">Solicitações</LinkWithLocation>
        </Menu.Item>
      )}
      {massificadoPermission &&
        // @ts-ignore
        <Menu.SubMenu
          key="Massificado"
          title="Massificado"
        >
          {/* @ts-ignore */}
          <Menu.Item key="MassificadoHome">
            <LinkWithLocation to="/procuracoes/massificado">Massificado Home</LinkWithLocation>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item key="MassificadoMinuta">
            <LinkWithLocation to="/procuracoes/massificado/minuta">Massificado Minuta</LinkWithLocation>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item disabled key="MassificadoCadastro">
            <LinkWithLocation to="/procuracoes/massificado/cadastro">Massificado Cadastro</LinkWithLocation>
          </Menu.Item>
        </Menu.SubMenu>
      }
    </Menu.SubMenu >
  );
}

export default ProcuracoesEntries;
