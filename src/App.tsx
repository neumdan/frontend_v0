import React, { useState } from 'react';
import { 
  Layout, 
  // theme
 } from 'antd';
import { NavHeader } from './_components/NavHeader';
import { NavSider } from './_components/NavSider';
import { Outlet } from 'react-router-dom'


// Styles
import './_styles/App.css';

const { Header, Content, Footer, Sider } = Layout;

// const headerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: '#fff',
//   height: 64,
//   paddingInline: 50,
//   lineHeight: '64px',
//   backgroundColor: '#7dbcea',
// };

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();


  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Header 
          className="site-layout-background">
          <NavHeader />
        </Header>
        <Layout className="site-layout">
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          collapsedWidth={48}
        >
          <NavSider />
        </Sider>
        <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          {/* <div style={{ padding: 15, minHeight: 360, background: colorBgContainer }}> */}
          <Outlet />
          {/* </div> */}
        </Content>
        <Footer 
                style={{ textAlign: 'center' }}
              >
                WBMT ©{new Date().getUTCFullYear()} Created by Daniel Neumann (Version 0.9.9)
              </Footer>
              </Layout>
              </Layout>

    </Layout>
  );
};

export { App };