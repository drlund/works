import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

function PodcastsEntries(props) {

  const subMenuProps = { ...props };
  delete subMenuProps.toggleSideBar;
  delete subMenuProps.authState;
  delete subMenuProps.isFullScreenMode;
  delete subMenuProps.sideBarCollapsed;
  delete subMenuProps.warnKey;

  return (
    <Menu.Item {...subMenuProps} key="podcasts" >
      <Link to="/podcasts/">
        <span>
          <AudioOutlined />
          <span>Podcasts</span>
        </span>
      </Link>
    </Menu.Item>
  );
}

export default PodcastsEntries;
