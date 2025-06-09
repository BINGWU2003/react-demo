import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在</p>
      <Link to="/" style={{ color: '#1890ff', textDecoration: 'none' }}>
        返回首页
      </Link>
    </div>
  );
};

export default NotFound; 