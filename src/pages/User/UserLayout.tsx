import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

const UserLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/user/profile',
      label: <Link to="/user/profile">个人资料</Link>,
    },
    {
      key: '/user/settings',
      label: <Link to="/user/settings">设置</Link>,
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '200px' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout; 