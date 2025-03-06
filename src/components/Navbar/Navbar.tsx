import React from 'react';
import { Layout, Avatar, Typography, Space, Dropdown } from 'antd';
import { UserOutlined, DownOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './Navbar.module.scss';

const { Header } = Layout;
const { Title } = Typography;

const userMenuItems = [
  {
    key: 'profile',
    label: 'My Profile',
  },
  {
    key: 'settings',
    label: 'Settings',
  },
  {
    key: 'logout',
    label: 'Logout',
    danger: true,
  },
];

const Navbar: React.FC = () => {
  return (
    <Header className={styles.navbar}>
      <div className={styles.logoContainer}>
        <SwapOutlined className={styles.logoIcon} />
        <Title level={4} className={styles.logoText}>Product Comparison</Title>
      </div>
      <div className={styles.userProfile}>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className={styles.userInfo}>
            <Avatar 
              icon={<UserOutlined />} 
              src="/path/to/profile-pic.png" 
              size="large"
              className={styles.avatar}
            />
            <span className={styles.username}>Username</span>
            <DownOutlined className={styles.dropdownIcon} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;