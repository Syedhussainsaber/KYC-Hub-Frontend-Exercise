import React, { useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import styles from './App.module.scss';

const { Content } = Layout;

const App: React.FC = () => {

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <Layout className={styles.appLayout}>
        <Navbar />
        <Layout className={styles.mainLayout}>
          <Sidebar />
          <Layout className={styles.contentLayout}>
            <Content className={styles.content}>
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;