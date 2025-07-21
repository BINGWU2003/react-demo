import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user';
import { loginUser } from '../services/user';
import { message } from 'antd';
const Login: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const setLoginInfo = useUserStore((state) => state.setLoginInfo);
  const from = location.state?.from?.pathname || '/';

  const onFinish = (user: { email: string, password: string }) => {
    loginUser(user).then((res) => {
      setLoginInfo(res);
      messageApi.open({
        type: 'success',
        content: '登录成功',
        duration: 2
      }).then(() => {
        navigate(from, { replace: true });
      })
    }).catch(() => {
      messageApi.error('登录失败');
    });

  };

  return (
    <>
      {contextHolder}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5'
      }}>
        <Card title="登录" style={{ width: 400 }}>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: '请输入邮箱!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login; 