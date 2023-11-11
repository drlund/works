import { TeamOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';

import { LinkWithLocation } from '@/components/LinkWithLocation';
import { usePeopleCostFlag } from '@/pages/peopleCost/peopleCostAcessos';

function CostsEntries({
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
  const flag = usePeopleCostFlag();

  if (!flag) {
    return null;
  }

  return (
    <Menu.SubMenu
      {...subMenuProps}
      key="costs"
      title={(
        <span>
          <TeamOutlined />
          <span>Custos de Pessoas</span>
        </span>
      )}
    >
      {/* @ts-ignore */}
      <Menu.Item key="meeting">
        <LinkWithLocation to="/costs/meeting/">Custo da Reunião</LinkWithLocation>
      </Menu.Item>
      {/* @ts-ignore */}
      <Menu.Item key="efficiency">
        <LinkWithLocation to="/costs/efficiency/">Custo de Eficiência</LinkWithLocation>
      </Menu.Item>
    </Menu.SubMenu >
  );
}

export default CostsEntries;
