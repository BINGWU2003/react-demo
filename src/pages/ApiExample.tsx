import React, { useState } from 'react';
import { Button, Form, Input, Table, Space, Card, Divider } from 'antd';
import { useApi, useApiData } from '../hooks/useApi';
import { userApi, dataApi } from '../services/api';
import type { DataItem, LoginRequest } from '../types/api';

const ApiExample: React.FC = () => {
  // 登录API示例
  const loginApi = useApi(userApi.login, {
    showSuccessMessage: true,
    successMessage: '登录成功！'
  });

  // 获取数据列表API示例
  const {
    data: dataList,
    loading: dataLoading,
    fetch: fetchData
  } = useApiData(dataApi.getList, true); // immediate=true 立即执行

  // 创建数据API示例
  const createDataApi = useApi(dataApi.create, {
    showSuccessMessage: true,
    successMessage: '创建成功！'
  });

  // 删除数据API示例
  const deleteDataApi = useApi(dataApi.delete, {
    showSuccessMessage: true,
    successMessage: '删除成功！'
  });

  const [form] = Form.useForm();

  // 处理登录
  const handleLogin = async (values: LoginRequest) => {
    try {
      const token = await loginApi.execute(values);
      console.log('登录成功，token:', token);
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  // 处理创建数据
  const handleCreateData = async (values: any) => {
    try {
      await createDataApi.execute(values);
      form.resetFields();
      fetchData(); // 重新获取数据列表
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理删除数据
  const handleDelete = async (id: number) => {
    try {
      await deleteDataApi.execute(id);
      fetchData(); // 重新获取数据列表
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: DataItem) => (
        <Space>
          <Button
            type='link'
            danger
            onClick={() => handleDelete(record.id)}
            loading={deleteDataApi.loading}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Axios API 使用示例</h1>

      {/* 登录示例 */}
      <Card
        title='登录示例'
        style={{ marginBottom: 20 }}
      >
        <Form
          layout='inline'
          onFinish={handleLogin}
          initialValues={{ username: 'admin', password: '123456' }}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder='用户名' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder='密码' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loginApi.loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      {/* 创建数据示例 */}
      <Card
        title='创建数据示例'
        style={{ marginBottom: 20 }}
      >
        <Form
          form={form}
          layout='inline'
          onFinish={handleCreateData}
        >
          <Form.Item
            name='title'
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder='标题' />
          </Form.Item>
          <Form.Item
            name='content'
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input placeholder='内容' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={createDataApi.loading}
            >
              创建
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      {/* 数据列表示例 */}
      <Card title='数据列表示例'>
        <div style={{ marginBottom: 16 }}>
          <Button
            onClick={fetchData}
            loading={dataLoading}
          >
            刷新数据
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataList?.list || []}
          loading={dataLoading}
          rowKey='id'
          pagination={{
            current: dataList?.page || 1,
            pageSize: dataList?.pageSize || 10,
            total: dataList?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );
};

export default ApiExample;
