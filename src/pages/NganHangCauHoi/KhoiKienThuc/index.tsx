import { Button, Card, Form, Input, message, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
	generateId,
	getKhoiKienThucs,
	KhoiKienThuc,
	saveKhoiKienThucs,
} from '../data';

const { Title } = Typography;

const KhoiKienThucPage: React.FC = () => {
	const [data, setData] = useState<KhoiKienThuc[]>(getKhoiKienThucs);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<KhoiKienThuc | null>(null);
	const [form] = Form.useForm();

	const persist = (next: KhoiKienThuc[]) => {
		setData(next);
		saveKhoiKienThucs(next);
	};

	const openAdd = () => {
		setEditing(null);
		form.resetFields();
		setModalOpen(true);
	};

	const openEdit = (record: KhoiKienThuc) => {
		setEditing(record);
		setModalOpen(true);
	};

	useEffect(() => {
		if (modalOpen && editing) {
			form.setFieldsValue(editing);
		} else if (modalOpen && !editing) {
			form.resetFields();
		}
	}, [modalOpen, editing]);

	const handleDelete = (id: string) => {
		persist(data.filter((d) => d.id !== id));
		message.success('Đã xoá khối kiến thức!');
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			if (editing) {
				persist(data.map((d) => (d.id === editing.id ? { ...editing, ...values } : d)));
				message.success('Cập nhật thành công!');
			} else {
				const newItem: KhoiKienThuc = { id: generateId(), ...values };
				persist([...data, newItem]);
				message.success('Thêm mới thành công!');
			}
			setModalOpen(false);
		});
	};

	const columns = [
		{
			title: 'Mã khối',
			dataIndex: 'maKhoi',
			key: 'maKhoi',
			width: 150,
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'tenKhoi',
			key: 'tenKhoi',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 140,
			render: (_: any, record: KhoiKienThuc) => (
				<Space>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => openEdit(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title="Xác nhận xoá?"
						onConfirm={() => handleDelete(record.id)}
						okText="Xoá"
						cancelText="Huỷ"
					>
						<Button type="link" danger icon={<DeleteOutlined />}>
							Xoá
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Title level={3} style={{ margin: 0 }}>Danh mục khối kiến thức</Title>
				<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
					Thêm mới
				</Button>
			</div>
			<Card>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={data}
					pagination={{ pageSize: 10 }}
					bordered
					size="middle"
				/>
			</Card>

			<Modal
				title={editing ? 'Chỉnh sửa khối kiến thức' : 'Thêm khối kiến thức mới'}
				visible={modalOpen}
				onOk={handleOk}
				onCancel={() => setModalOpen(false)}
				okText={editing ? 'Cập nhật' : 'Thêm mới'}
				cancelText="Huỷ"
			>
				<Form form={form} layout="vertical" style={{ marginTop: 16 }}>
					<Form.Item
						label="Mã khối"
						name="maKhoi"
						rules={[{ required: true, message: 'Vui lòng nhập mã khối!' }]}
					>
						<Input placeholder="VD: KKT001" />
					</Form.Item>
					<Form.Item
						label="Tên khối kiến thức"
						name="tenKhoi"
						rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức!' }]}
					>
						<Input placeholder="VD: Tổng quan" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default KhoiKienThucPage;
