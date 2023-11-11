import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;
function MenuManager() {
  return (
    <Layout style={{ backgroundColor: 'white', margin: 0 }}>
      <Content style={{ padding: '24px' }}>
        <h1>Menu Manager Tab</h1>
      </Content>
    </Layout>
  );
}

export default MenuManager;
