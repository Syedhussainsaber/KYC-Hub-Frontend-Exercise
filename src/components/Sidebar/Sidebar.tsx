import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  SwapOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Product Details',
    },
    {
      key: '/compare',
      icon: <SwapOutlined />,
      label: 'Compare Products',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <Sider 
      className={styles.sidebar} 
      width={240} 
      collapsible 
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
    >
      <div className={styles.sidebarLogo}>
        {!collapsed && (
          <Title level={5} className={styles.sidebarLogoText}>
            Product Hub
          </Title>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        className={styles.sidebarMenu}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </Sider>
  );
};

export default Sidebar;