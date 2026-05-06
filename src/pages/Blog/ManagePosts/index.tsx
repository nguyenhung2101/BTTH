import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Drawer, Form, Input, Popconfirm, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import type { BlogPost, BlogPostFormValues } from '@/models/blog';
import { createBlogPost, deleteBlogPost, formatBlogDate, getBlogPosts, getBlogTags, slugifyTitle, updateBlogPost } from '@/services/blog';
import styles from './index.less';

const { Text } = Typography;
const { TextArea } = Input;

export default function ManagePosts() {
	const [form] = Form.useForm<BlogPostFormValues>();
	const [data, setData] = useState<BlogPost[]>([]);
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState<'ALL' | BlogPost['status']>('ALL');
	const [visible, setVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

	const refresh = () => setData(getBlogPosts());

	useEffect(() => {
		refresh();
	}, []);

	const openCreate = () => {
		setEditingPost(null);
		form.resetFields();
		form.setFieldsValue({ status: 'DRAFT', tags: [], title: '', slug: '', summary: '', content: '', coverImage: '' });
		setVisible(true);
	};

	const openEdit = (record: BlogPost) => {
		setEditingPost(record);
		form.setFieldsValue({
			title: record.title,
			slug: record.slug,
			summary: record.summary,
			content: record.content,
			coverImage: record.coverImage,
			tags: record.tags,
			status: record.status,
		});
		setVisible(true);
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const payload = {
			...values,
			slug: values.slug?.trim() || slugifyTitle(values.title),
		};
		if (editingPost) {
			updateBlogPost(editingPost.id, payload);
			message.success('Đã cập nhật bài viết');
		} else {
			createBlogPost(payload);
			message.success('Đã tạo bài viết mới');
		}
		setVisible(false);
		refresh();
	};

	const filteredData = data.filter((post) => {
		const matchesKeyword = !keyword || post.title.toLowerCase().includes(keyword.toLowerCase());
		const matchesStatus = status === 'ALL' || post.status === status;
		return matchesKeyword && matchesStatus;
	});

	const columns: ColumnsType<BlogPost> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 260,
			render: (_, record) => <Text strong>{record.title}</Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (_, record) => <Tag color={record.status === 'PUBLISHED' ? 'green' : 'gold'}>{record.status === 'PUBLISHED' ? 'Đã đăng' : 'Nháp'}</Tag>,
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			render: (_, record) => (
				<Space wrap>
					{record.tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			width: 120,
			align: 'right',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 130,
			render: (_, record) => formatBlogDate(record.createdAt),
		},
		{
			title: 'Thao tác',
			width: 160,
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title="Xóa bài viết này?"
						description="Thao tác này không thể hoàn tác."
						onConfirm={() => {
							deleteBlogPost(record.id);
							message.success('Đã xóa bài viết');
							refresh();
						}}
					>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const tagOptions = getBlogTags().map((tag) => ({ label: tag.name, value: tag.name }));

	return (
		<div className={styles.page}>
			<Card bordered={false} className={styles.toolbarCard}>
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} md={12}>
						<Input
							allowClear
							prefix={<SearchOutlined />}
							placeholder="Tìm theo tiêu đề..."
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
						/>
					</Col>
					<Col xs={24} md={6}>
						<Select
							value={status}
							onChange={setStatus}
							style={{ width: '100%' }}
							options={[
								{ label: 'Tất cả', value: 'ALL' },
								{ label: 'Nháp', value: 'DRAFT' },
								{ label: 'Đã đăng', value: 'PUBLISHED' },
							]}
						/>
					</Col>
					<Col xs={24} md={6} style={{ textAlign: 'right' }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
							Thêm bài viết
						</Button>
					</Col>
				</Row>
			</Card>

			<Card bordered={false} className={styles.tableCard}>
				<Table<BlogPost>
					rowKey="id"
					columns={columns}
					dataSource={filteredData}
					pagination={{ pageSize: 8 }}
				/>
			</Card>

			<Drawer
				title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
				width={720}
				onClose={() => setVisible(false)}
				visible={visible}
				destroyOnClose
				footer={
					<Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
						<Button type="primary" onClick={handleSubmit}>
							Lưu bài viết
						</Button>
					</Space>
				}
			>
				<Form layout="vertical" form={form} initialValues={{ status: 'DRAFT' }}>
					<Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
						<Input placeholder="Nhập tiêu đề bài viết" />
					</Form.Item>
					<Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
						<Input placeholder="duong-dan-bai-viet" />
					</Form.Item>
					<Form.Item label="Tóm tắt" name="summary" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
						<TextArea rows={3} placeholder="Mô tả ngắn gọn nội dung bài viết" />
					</Form.Item>
					<Form.Item label="Nội dung Markdown" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
						<TextArea rows={10} placeholder="# Heading\n\nNội dung bài viết..." />
					</Form.Item>
					<Form.Item label="Ảnh đại diện (URL)" name="coverImage" rules={[{ required: true, message: 'Vui lòng nhập ảnh đại diện' }]}>
						<Input placeholder="https://..." />
					</Form.Item>
					<Form.Item label="Thẻ" name="tags" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}>
						<Select mode="tags" placeholder="Chọn hoặc nhập tag" options={tagOptions} />
					</Form.Item>
					<Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select
							options={[
								{ label: 'Nháp', value: 'DRAFT' },
								{ label: 'Đã đăng', value: 'PUBLISHED' },
							]}
						/>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
}
