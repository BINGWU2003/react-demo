import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout as AntdLayout, Menu } from 'antd';
import Breadcrumb from '../Breadcrumb';
import style from './index.module.scss';
const { Header, Content, Footer, Sider } = AntdLayout;

const Layout = () => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 根据当前路径获取选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname;

    // 处理用户中心子菜单
    if (pathname.startsWith('/user/')) {
      return [pathname.split('/')[2]]; // profile 或 settings
    }

    // 处理其他菜单项
    const keyMap: Record<string, string> = {
      '/': 'home',
      '/about': 'about',
      '/contact': 'contact',
      '/api-example': 'api-example',
      '/user-list': 'user-list'
    };

    return [keyMap[pathname] || ''];
  };

  const selectedKeys = getSelectedKeys();

  // 根据路径自动打开对应的子菜单
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/user/')) {
      setOpenKeys(['user']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const menuItems = [
    {
      key: 'home',
      label: <Link to='/'>首页</Link>
    },
    {
      key: 'about',
      label: <Link to='/about'>关于我们</Link>
    },
    {
      key: 'contact',
      label: <Link to='/contact'>联系我们</Link>
    },
    {
      key: 'api-example',
      label: <Link to='/api-example'>API示例</Link>
    },
    {
      key: 'user-list',
      label: <Link to='/user-list'>用户列表</Link>
    },
    {
      key: 'book',
      label: <Link to='/book'>图书列表</Link>
    },
    {
      key: 'user',
      label: '用户中心',
      children: [
        {
          key: 'profile',
          label: <Link to='/user/profile'>个人资料</Link>
        },
        {
          key: 'settings',
          label: <Link to='/user/settings'>设置</Link>
        }
      ]
    }
  ];

  return (
    <AntdLayout className={style['layout']}>
      <Sider>
        <div className={style['sider']}>React Demo</div>
        <Menu
          theme='dark'
          mode='inline'
          items={menuItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={(keys) => {
            // 只允许同时打开一个子菜单
            const latestOpenKey = keys.find((key) => !openKeys.includes(key));
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
          }}
        />
      </Sider>
      <AntdLayout>
        <Header className={style['header']}>
          <div className={style['header-content']}>
            <Breadcrumb />
          </div>
        </Header>
        <Content className={style['content']}>
          <div className={style['wrapper']}>
            <Outlet />
          </div>
        </Content>
        <Footer className={style['footer']}>
          React Demo ©2024 Created with Ant Design
        </Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
