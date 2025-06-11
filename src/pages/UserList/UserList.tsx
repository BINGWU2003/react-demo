import { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  const queryClient = useQueryClient();

  // 🎯 获取用户列表
  const {
    data: listData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', query],
    queryFn: () => getUserList(query),
    select: (data) => data as unknown as ListResponse<UserItem> // 类型断言
  });

  // 🎯 创建用户 Mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('用户创建成功！');
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      messageApi.open({
        type: 'error',
        content: error.response?.data?.message || '创建用户失败'
      });
    }
  });

  // 🎯 更新用户 Mutation
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('用户更新成功！');
      handleCloseModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      messageApi.open({
        type: 'error',
        content: error.response?.data?.message || '更新用户失败'
      });
    }
  });

  // 刷新数据
  const handleRefresh = () => {
    refetch();
  };

  // 改变页码
  const handlePageChange = (page: number, pageSize: number) => {
    setQuery({ page, limit: pageSize });
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
        updateMutation.mutate({
          ...editingUser,
          ...values
        });
      } else {
        // 创建用户
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  if (error) {
    return <div>加载失败: {(error as Error).message}</div>;
  }

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button
          onClick={handleRefresh}
          loading={isLoading}
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
        loading={isLoading}
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
        confirmLoading={createMutation.isPending || updateMutation.isPending}
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
