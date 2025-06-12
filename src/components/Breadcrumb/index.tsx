import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  TeamOutlined,
  PhoneOutlined,
  ApiOutlined,
  UserOutlined,
  SettingOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import styles from './index.module.scss';

// 路由配置映射
const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/': { title: '首页', icon: <HomeOutlined /> },
  '/about': { title: '关于我们', icon: <TeamOutlined /> },
  '/contact': { title: '联系我们', icon: <PhoneOutlined /> },
  '/api-example': { title: 'API示例', icon: <ApiOutlined /> },
  '/user-list': { title: '用户列表', icon: <UserOutlined /> },
  '/user': { title: '用户中心', icon: <UserOutlined /> },
  '/user/profile': { title: '个人资料', icon: <ProfileOutlined /> },
  '/user/settings': { title: '设置', icon: <SettingOutlined /> }
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  // 生成面包屑项
  const breadcrumbItems = [];

  // 如果不是首页，添加首页链接
  if (pathSnippets.length > 0) {
    breadcrumbItems.push({
      key: 'home',
      title: (
        <Link
          to='/'
          className={styles.breadcrumbLink}
        >
          <HomeOutlined className={styles.icon} />
          <span>首页</span>
        </Link>
      )
    });
  } else {
    // 如果是首页，显示当前页面样式
    breadcrumbItems.push({
      key: 'home',
      title: (
        <span className={styles.currentPage}>
          <HomeOutlined className={styles.icon} />
          <span>首页</span>
        </span>
      )
    });
  }

  // 添加其他路径项
  if (pathSnippets.length > 0) {
    pathSnippets.forEach((snippet, index) => {
      const path = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const routeInfo = routeConfig[path];

      if (routeInfo) {
        const isLast = index === pathSnippets.length - 1;

        breadcrumbItems.push({
          key: path,
          title: isLast ? (
            // 最后一项不设置链接
            <span className={styles.currentPage}>
              {routeInfo.icon && (
                <span className={styles.icon}>{routeInfo.icon}</span>
              )}
              <span>{routeInfo.title}</span>
            </span>
          ) : (
            <Link
              to={path}
              className={styles.breadcrumbLink}
            >
              {routeInfo.icon && (
                <span className={styles.icon}>{routeInfo.icon}</span>
              )}
              <span>{routeInfo.title}</span>
            </Link>
          )
        });
      }
    });
  }

  return (
    <div className={styles.breadcrumb}>
      <AntdBreadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumb;
