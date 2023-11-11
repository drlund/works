import { BookOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useProcuracoesMassificado } from 'pages/procuracoes/hooks/useProcuracoesMassificado';
import { useProcuracoesPilotoPermission } from 'pages/procuracoes/hooks/useProcuracoesPilotoPermission';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  const permissaoUsuario = useProcuracoesPilotoPermission();
  const massificadoPermission = useProcuracoesMassificado();
  const location = useLocation();

  if (!permissaoUsuario) {
    return null;
  }

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
        <Link to="/procuracoes/">Home</Link>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Minuta">
        <Link to="/procuracoes/minuta">Minuta</Link>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Cadastrar">
        <Link to="/procuracoes/cadastrar">Cadastrar</Link>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="Pesquisar">
        <Link to="/procuracoes/pesquisar">Pesquisar</Link>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item disabled key="Gestão">
        <Link to="/procuracoes/gestao">Gestão</Link>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item disabled key="Solicitações">
        <Link to="/procuracoes/solicitacoes">Solicitações</Link>
      </Menu.Item>
      {massificadoPermission &&
        // @ts-ignore
        <Menu.SubMenu
          key="Massificado"
          title="Massificado"
        >
          {/* @ts-ignore */}
          <Menu.Item key="MassificadoHome">
            <Link to={{
              pathname: "/procuracoes/massificado",
              search: location.search
            }}>Massificado Home</Link>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item key="MassificadoMinuta">
            <Link to={{
              pathname: "/procuracoes/massificado/minuta",
              search: location.search
            }}>Massificado Minuta</Link>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item disabled key="MassificadoCadastro">
            <Link to={{
              pathname: "/procuracoes/massificado/cadastro",
              search: location.search
            }}>Massificado Cadastro</Link>
          </Menu.Item>
        </Menu.SubMenu>
      }
    </Menu.SubMenu >
  );
}

export default ProcuracoesEntries;
