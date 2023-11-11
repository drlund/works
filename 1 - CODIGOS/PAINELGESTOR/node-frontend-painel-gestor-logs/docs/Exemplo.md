# Exemplos

## Sidebar

```jsx
// src/components/sidebar/menuEntries/MinhaFerramentaEntries.js

import { Link } from 'react-router-dom';
import { verifyPermission } from 'utils/Commons';

const ferramenta = 'minhaFerramenta';

export default function MinhaFerramentaEntries({
  authState,
  toggleSideBar,
  isFullScreenMode,
  sideBarCollapsed,
  warnKey,
  ...subMenuProps
}) {
  const permissaoUsuario = verifyPermission({
    ferramenta,
    permissoesRequeridas: ['USUARIO', 'ADM', 'SOLUCOESDIGITAIS'],
    authState,
  });

  if (!permissaoUsuario) {
    return null;
  }

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="minhaFerramenta"
      title={(
        <span>
          <MinhaFerramentaIcon />
          <span>Minha Ferramenta</span>
        </span>
      )}
    >
      <Menu.Item key="home">
        <Link to="/ferramenta/">Home</Link>
      </Menu.Item>
      <Menu.Item key="cadastrar">
        <Link to="/ferramenta/cadastrar">Cadastrar</Link>
      </Menu.Item>
    </Menu.SubMenu>
  );
}
```

```jsx
// src/components/sidebar/SideBar.js
{/* ... */}
import MinhaFerramentaEntries from './menuEntries/MinhaFerramentaEntries';
{/* ... */}
<Menu
    theme="dark"
    mode="inline"
    className="sidebar-menu"
    openKeys={openKeys}
    onOpenChange={this.onOpenChange}
  >
    {/* Entradas do Menus */}
    <OutrasFerramentasEntries1 {...this.props} />
    <OutrasFerramentasEntries2 {...this.props} />
    <OutrasFerramentasEntries3 {...this.props} />
    <OutrasFerramentasEntries4 {...this.props} />
    {/* ... */}
    <MinhaFerramentaEntries {...this.props} />
</Menu>
{/* ... */}
```

## Rotas

```jsx
// src/config/apps/minhaFerramenta.config.js

const basePath = '/minhaFerramenta';

/**
 * Rota basica minima dos breadcrumbs.
 */
const baseBCRoutes = [
  {
    path: '/',
    breadcrumbName: <MinhaFerramentaIcon />,
  },
  {
    breadcrumbName: 'Minha Ferramenta',
    path: basePath,
  },
];

export const MinhaFerramentaConfig = {
  title: 'Minha Ferramenta',
  name: 'Minha Ferramenta',

  routes: [
    {
      title: 'Home',
      default: true,
      path: basePath,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/minhaFerramenta/Home')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
      ],
    },
    {
      // root da rota cadastrar
      title: 'Minha Ferramenta',
      path: `${basePath}/cadastrar`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/minhaFerramenta/Cadastrar')),
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Cadastrar',
          path: `${basePath}/cadastrar`,
        },
      ],
    },
    {
      // recebendo um idCadastro como slug
      title: 'Minha Ferramenta',
      path: `${basePath}/cadastrar/:idCadastro`,
      secondaryLayout: true,
      component: React.lazy(() => import('pages/minhaFerramenta/Cadastrar'))
      breadcrumbRoutes: [
        ...baseBCRoutes,
        {
          breadcrumbName: 'Cadastrar',
          path: 'cadastrar',
        },
        {
          breadcrumbName: 'Continuar um Cadastro',
        },
      ],
    },
  ],
};

/**
 * Funcao que retorna a configuracao da rota padrao do aplicativo.
 */
export const getDefaultRoute = () => MinhaFerramentaConfig.routes.find((item) => item.default);
```

```jsx
// src/config/menu.config.js

{/* ... */}
import { MinhaFerramentaConfig } from './apps/minhaFerramenta.config';

import AppConfig from './app.config';

export const DefaultPage = getDefaultRoute();

export default {
  {/* ... */}
  minhaFerramenta: MinhaFerramentaConfig,
};
```
