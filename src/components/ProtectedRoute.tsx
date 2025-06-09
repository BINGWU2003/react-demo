import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true
}: ProtectedRouteProps) => {
  const location = useLocation();
  // 这里可以替换为真实的认证逻辑
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (requireAuth && !isAuthenticated) {
    // 重定向到登录页面，并保存当前位置
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
