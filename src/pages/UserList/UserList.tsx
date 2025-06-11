import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Space } from 'antd';
import { useApi } from '../../hooks/useApi';
import { getUserList, createUser, updateUser } from '../../services/user';
import type { Query, ListResponse } from '../../types/params';
import type { UserItem, User } from '../../types/user';

const UserList = () => {
  const [query, setQuery] = useState<Query>({
    page: 1,
    limit: 10
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form] = Form.useForm<User>();
  const [messageApi, contextHolder] = message.useMessage();

  const getUserListApi = useApi(getUserList);
  const createUserApi = useApi(createUser, {
    showSuccessMessage: true,
    successMessage: '用户创建成功！'
  });
  const updateUserApi = useApi(updateUser, {
    showSuccessMessage: true,
    successMessage: '用户更新成功！'
  });

  // 组件渲染完毕后调用接口
  useEffect(() => {
    getUserListApi.execute(query);
  }, []); // 空依赖数组，只在组件挂载后执行一次

  // 监听创建成功，刷新列表
  useEffect(() => {
    if (createUserApi.data) {
      setIsModalOpen(false);
      form.resetFields();
      handleRefresh();
    }
  }, [createUserApi.data]);

  // 监听更新成功，刷新列表
  useEffect(() => {
    if (updateUserApi.data) {
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingUser(null);
      form.resetFields();
      handleRefresh();
    }
  }, [updateUserApi.data]);

  // 刷新数据
  const handleRefresh = () => {
    getUserListApi.execute(query);
  };

  // 改变页码
  const handlePageChange = (page: number, pageSize: number) => {
    setQuery((prev) => ({ ...prev, page, limit: pageSize }));
  };

  // 打开添加用户弹窗
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 打开编辑用户弹窗
  const handleEditUser = (user: UserItem) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email
    });
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && editingUser) {
        // 更新用户
        await updateUserApi.execute({
          ...editingUser,
          ...values
        });
      } else {
        // 创建用户
        await createUserApi.execute(values);
      }
    } catch (error: unknown) {
      console.error(error);
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'AxiosError'
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        messageApi.open({
          type: 'error',
          content: axiosError.response?.data?.message || '操作失败'
        });
      }
    }
  };

  // 类型断言处理数据
  const listData = getUserListApi.data as ListResponse<UserItem> | null;

  if (getUserListApi.error) {
    return <div>加载失败: {getUserListApi.error.message}</div>;
  }

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button
          onClick={handleRefresh}
          loading={getUserListApi.loading}
        >
          刷新数据
        </Button>
        <Button
          type='primary'
          onClick={handleOpenModal}
        >
          添加用户
        </Button>
      </div>

      <Table
        dataSource={listData?.list || []}
        loading={getUserListApi.loading}
        rowKey='id'
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: listData?.pagination?.total || 0,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: [10, 15, 20],
          showLessItems: true
        }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: Date) => new Date(date).toLocaleString()
          },
          {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (date: Date) => new Date(date).toLocaleString()
          },
          {
            title: '操作',
            key: 'actions',
            width: 120,
            render: (_, record: UserItem) => (
              <Space>
                <Button
                  type='link'
                  size='small'
                  onClick={() => handleEditUser(record)}
                >
                  编辑
                </Button>
                <Button
                  type='link'
                  size='small'
                  danger
                  onClick={() => console.log('删除用户:', record.id)}
                >
                  删除
                </Button>
              </Space>
            )
          }
        ]}
      />

      {/* 添加/编辑用户弹窗 */}
      <Modal
        title={isEditing ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={createUserApi.loading || updateUserApi.loading}
        maskClosable={false}
        width={500}
      >
        <Form
          form={form}
          layout='vertical'
          autoComplete='off'
        >
          <Form.Item
            label='姓名'
            name='name'
            rules={[
              { required: true, message: '请输入用户姓名' },
              { min: 2, message: '姓名至少2个字符' },
              { max: 20, message: '姓名不能超过20个字符' }
            ]}
          >
            <Input
              placeholder='请输入用户姓名'
              maxLength={20}
              showCount
            />
          </Form.Item>

          <Form.Item
            label='邮箱'
            name='email'
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              placeholder='请输入邮箱地址'
              maxLength={50}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
