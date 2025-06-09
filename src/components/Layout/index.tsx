import { Outlet, Link } from 'react-router-dom';
import { Layout as AntdLayout, Menu } from 'antd';
import style from './index.module.scss'
const { Header, Content, Footer, Sider } = AntdLayout;

const Layout = () => {
  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'about',
      label: <Link to="/about">关于我们</Link>,
    },
    {
      key: 'contact',
      label: <Link to="/contact">联系我们</Link>,
    },
    {
      key: 'user',
      label: '用户中心',
      children: [
        {
          key: 'profile',
          label: <Link to="/user/profile">个人资料</Link>,
        },
        {
          key: 'settings',
          label: <Link to="/user/settings">设置</Link>,
        },
      ],
    },
  ];

  return (
    <AntdLayout className={style['layout']}>
      <Sider>
        <div className={style['sider']}>
          React Demo
        </div>
        <Menu
          theme="dark"
          items={menuItems}
        />

      </Sider>
      <AntdLayout>
        <Header className={style['header']}>
          <div className={style['header-content']}>
            Header
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