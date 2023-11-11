import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleSideBar } from 'services/actions/commons';
import './NavBar.css';
import "@/App.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Row, Col } from 'antd';
import AvatarDropdown from './AvatarDropdown';
const { Header } = Layout;


class NavBar extends Component {

render() {
    let shown = this.props.isFullScreenMode ? 'hidden' : '';

    return (
      <Header className={`navbar-main slide-up ${shown}`}>
        <Row type="flex" justify="space-between">
          <Col span={12}>
            <span className="navbar-menu-item" id="sidebar-trigger" onClick={() => this.props.toggleSideBar()} >
              { this.props.sideBarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }
            </span>
          </Col>
          <Col span={12}>
            <Row type="flex" justify="end">
              <Col span={2}>
                <AvatarDropdown />
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    );
  }
}

const mapStateToProps = state => {
  return { 
    sideBarCollapsed: state.app.sideBarCollapsed,
    isFullScreenMode: state.app.fullScreenMode
  }
}

export default connect(mapStateToProps, { toggleSideBar }) (NavBar);
