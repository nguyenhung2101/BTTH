import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import type { BlogTag } from '@/models/blog';
import { createBlogTag, deleteBlogTag, getBlogTagStats, updateBlogTag } from '@/services/blog';
import styles from './index.less';

type TagFormValues = {
	name: string;
	description?: string;
};

export default function ManageTags() {
	const [form] = Form.useForm<TagFormValues>();
	const [data, setData] = useState<(BlogTag & { postCount: number })[]>([]);
	const [keyword, setKeyword] = useState('');
	const [visible, setVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<(BlogTag & { postCount: number }) | null>(null);

	const refresh = () => setData(getBlogTagStats());

	useEffect(() => {
		refresh();
	}, []);

	const openCreate = () => {
		setEditingTag(null);
		form.resetFields();
		setVisible(true);
	};

	const openEdit = (record: BlogTag & { postCount: number }) => {
		setEditingTag(record);
		form.setFieldsValue({ name: record.name, description: record.description });
		setVisible(true);
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		if (editingTag) {
			updateBlogTag(editingTag.id, values.name, values.description);
			message.success('Đã cập nhật thẻ');
		} else {
			createBlogTag(values.name, values.description);
			message.success('Đã thêm thẻ mới');
		}
		setVisible(false);
		refresh();
	};

	const filteredData = data.filter((tag) => !keyword || tag.name.toLowerCase().includes(keyword.toLowerCase()));

	const columns: ColumnsType<BlogTag & { postCount: number }> = [
		{ title: 'Tên thẻ', dataIndex: 'name', render: (_, record) => <Tag color="blue">{record.name}</Tag> },
		{ title: 'Mô tả', dataIndex: 'description' },
		{ title: 'Số bài viết', dataIndex: 'postCount', width: 120, align: 'right' },
		{
			title: 'Thao tác',
			width: 160,
			render: (_, record) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title="Xóa thẻ này?"
						description="Thẻ sẽ bị gỡ khỏi các bài viết đang sử dụng."
						onConfirm={() => {
							deleteBlogTag(record.id);
							message.success('Đã xóa thẻ');
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

	return (
		<div className={styles.page}>
			<Card bordered={false} className={styles.toolbarCard}>
				<Space direction="vertical" size={16} style={{ width: '100%' }}>
					<Input
						allowClear
						prefix={<SearchOutlined />}
						placeholder="Tìm theo tên tag..."
						value={keyword}
						onChange={(event) => setKeyword(event.target.value)}
					/>
					<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
						Thêm thẻ
					</Button>
				</Space>
			</Card>

			<Card bordered={false} className={styles.tableCard}>
				<Table rowKey="id" columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} />
			</Card>

			<Modal
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				onOk={handleSubmit}
				destroyOnClose
			>
				<Form layout="vertical" form={form}>
					<Form.Item label="Tên thẻ" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
						<Input placeholder="Ví dụ: React" />
					</Form.Item>
					<Form.Item label="Mô tả" name="description">
						<Input.TextArea rows={3} placeholder="Mô tả ngắn về chủ đề của tag" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
