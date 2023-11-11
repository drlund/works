import React from "react";
import { Drawer, Button, Divider } from "antd";
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import PropTypes from 'prop-types'

function DrawerNotification(props) {
  const DefaultDrawerIcon = props.icon ? props.icon : <ExclamationCircleTwoTone />
  const drawerProps = {...props};
  delete drawerProps.onDrawerClose;
  delete drawerProps.footerDefaultButtonText;

  function onDrawerClose() {
    if (typeof props.onDrawerClose === "function") {
      props.onDrawerClose();
    }
  }

  const renderFooter = () => {
    if (props.footer) {
      return props.footer;
    }

    return (
      <>          
        <div style={{ textAlign: "center" }}>
          <Button type="primary" size="large" onClick={onDrawerClose}>
            {props.footerDefaultButtonText}
          </Button>
        </div>
      </>
    );
  };

  return (
    <Drawer
      {...drawerProps}
      title={
        <span>
          <span style={{ fontSize: 24, marginTop: 2 }}>
            {DefaultDrawerIcon}
          </span>
          <span style={{ fontSize: 22, marginLeft: 10, color: "#fff" }}>
            {props.title}
          </span>
        </span>
      }
      headerStyle={{ backgroundColor: "#7999b2" }}
      bodyStyle={props.bodyStyle || {}}
      placement={props.placement}
      closable={props.closable}
      onClose={onDrawerClose}
      visible={props.visible}      
    >
      <div style={{ fontSize: 18 }}>
        {props.children}
        <Divider />
        {renderFooter()}
      </div>
    </Drawer>
  );
};

DrawerNotification.propTypes = {
  title: PropTypes.string.isRequired,
  closable: PropTypes.bool,
  visible: PropTypes.bool.isRequired,
  height: PropTypes.number,
  onClose: PropTypes.func,
  placement: PropTypes.string,
  icon: PropTypes.node, //React node - default <ExclamationCircleTwoTone />
  footer: PropTypes.node,
  footerDefaultButtonText: PropTypes.string
}

DrawerNotification.defaultProps = {
  title: 'Atenção',
  closable: false,
  visible: false,
  height: 290,
  onClose: () => {},
  placement: 'bottom',
  icon: <ExclamationCircleTwoTone />,
  footerDefaultButtonText: 'OK'
}

export default DrawerNotification;
