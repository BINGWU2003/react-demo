import { useState, useEffect } from 'react';
import { Button, Table, message, Popconfirm, Modal, Form, Input } from 'antd';
import type { Book } from '../../types/book';
import { getBookList, createBook, deleteBook } from '../../services/book';
import type { Pagination } from '../../types/params';
import ContentHeader from '../../components/content-header';
const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    setIsLoading(true);
    getBookList({ page: 1, limit: 10 }).then((res) => {
      setBooks(res.list);
      setPagination(res.pagination);
      setIsLoading(false);
    });
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCreateBook = () => {
    form.validateFields().then((values) => {
      createBook(values).then(() => {
        setIsModalOpen(false);
        handleRefresh();
        messageApi.success('添加成功');
        form.resetFields();
      });
    });
  };
  const handleEditBook = (book: Book) => {
    console.log(book);
  };
  const handleRefresh = () => {
    setIsLoading(true);
    getBookList({ page: pagination.page, limit: pagination.limit }).then((res) => {
      setBooks(res.list);
      setPagination(res.pagination);
      setIsLoading(false);
    });
  };
  const handlePageChange = (page: number, pageSize: number) => {
    setIsLoading(true);
    getBookList({ page, limit: pageSize }).then((res) => {
      setBooks(res.list);
      setPagination(res.pagination);
      setIsLoading(false);
    });
  };
  const handleDeleteBook = (id: number) => {
    deleteBook(id).then(() => {
      handleRefresh();
      messageApi.success('删除成功');
    });
  };
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
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
      render: (_: string, record: Book) => (
        <>
          <Button type="link" onClick={() => handleEditBook(record)}>编辑</Button>
          <Popconfirm
            placement="right"
            title="确定要删除吗？"
            description="删除后将无法恢复"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteBook(record.id!)}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>

        </>
      )
    }
  ];
  return (
    <div>
      {contextHolder}
      <ContentHeader title='图书列表' description='图书列表描述'>
        <div style={{ display: 'flex', gap: 8 }}>
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
            添加图书
          </Button>
        </div>
      </ContentHeader>
      <Table dataSource={books} columns={columns} loading={isLoading} rowKey="id" pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: handlePageChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
        pageSizeOptions: [10, 15, 20],
        showLessItems: true
      }} />
      <Modal
        title="添加图书"
        open={isModalOpen}
        onOk={handleCreateBook}
        onCancel={handleCloseModal}
        confirmLoading={isLoading}
        maskClosable={false}
        width={500}
      >
        <Form form={form} layout='horizontal' autoComplete='off'>
          <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder='请输入标题' type='text' />
          </Form.Item>
          <Form.Item label='作者' name='author' rules={[{ required: true, message: '请输入作者' }]}>
            <Input placeholder='请输入作者' type='text' />
          </Form.Item>
          <Form.Item label='价格' name='price' rules={[{ required: true, message: '请输入价格' }]}>
            <Input placeholder='请输入价格' type='number' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookList;