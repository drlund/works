import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toggleSideBar, toggleFullScreen } from 'services/actions/commons';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import './PgHeader.css';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions
import history from '@/history';

class PgHeader extends Component {

  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last || (!route.path || !route.path.length)
      ? <span>{route.breadcrumbName}</span>
      : <Link to={`/${paths.join('/')}${history.location.search}`}>{route.breadcrumbName}</Link>;
  }

  onFullScreenMode = () => {
    if (!this.props.isFullScreenMode) {
      if (!this.props.sideBarCollapsed)
        this.props.toggleSideBar(true);
    } else {
      if (this.props.sideBarCollapsed)
        this.props.toggleSideBar(false);
    }
    
    this.props.toggleFullScreen(!this.props.isFullScreenMode);
  }

  render() {
    const iconType = this.props.isFullScreenMode ? <FullscreenExitOutlined />  : <FullscreenOutlined />;

    return (
      <PageHeader 
        title={this.props.title}
        subTitle={this.props.subTitle}
        className="pgheader-container" 
        breadcrumb={{ 
          routes: this.props.routes, 
          itemRender: this.itemRender 
        }}
        extra={[
          <Button 
            key="btn-fullscreen"
            icon={iconType}
            className="pgheader-icon" 
            onClick={() => this.onFullScreenMode()}
          />
        ]}
      />
    );
  }
}

const mapStateToProps = state => {
  return { 
    sideBarCollapsed: state.app.sideBarCollapsed,
    isFullScreenMode: state.app.fullScreenMode
  }
}

export default connect(mapStateToProps, {
  toggleSideBar,
  toggleFullScreen
})(PgHeader);
