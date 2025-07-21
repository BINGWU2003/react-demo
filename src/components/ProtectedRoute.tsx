import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true
}: ProtectedRouteProps) => {
  const location = useLocation();
  const loginInfo = useUserStore((state) => state.loginInfo);
  const isAuthenticated = loginInfo.token !== '';
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
