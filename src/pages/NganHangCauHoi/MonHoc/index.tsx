import { Button, Card, Form, Input, InputNumber, message, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { generateId, getMonHocs, MonHoc, saveMonHocs } from '../data';

const { Title } = Typography;

const MonHocPage: React.FC = () => {
	const [data, setData] = useState<MonHoc[]>(getMonHocs);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<MonHoc | null>(null);
	const [form] = Form.useForm();

	const persist = (next: MonHoc[]) => {
		setData(next);
		saveMonHocs(next);
	};

	const openAdd = () => {
		setEditing(null);
		form.resetFields();
		setModalOpen(true);
	};

	const openEdit = (record: MonHoc) => {
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
		message.success('Đã xoá môn học!');
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			if (editing) {
				persist(data.map((d) => (d.id === editing.id ? { ...editing, ...values } : d)));
				message.success('Cập nhật thành công!');
			} else {
				const newItem: MonHoc = { id: generateId(), ...values };
				persist([...data, newItem]);
				message.success('Thêm mới thành công!');
			}
			setModalOpen(false);
		});
	};

	const columns = [
		{
			title: 'Mã môn',
			dataIndex: 'maMon',
			key: 'maMon',
			width: 120,
		},
		{
			title: 'Tên môn học (Học phần)',
			dataIndex: 'tenMon',
			key: 'tenMon',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			key: 'soTinChi',
			width: 120,
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 140,
			render: (_: any, record: MonHoc) => (
				<Space>
					<Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>
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
				<Title level={3} style={{ margin: 0 }}>Danh mục môn học</Title>
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
				title={editing ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
				open={modalOpen}
				onOk={handleOk}
				onCancel={() => setModalOpen(false)}
				okText={editing ? 'Cập nhật' : 'Thêm mới'}
				cancelText="Huỷ"
			>
				<Form form={form} layout="vertical" style={{ marginTop: 16 }}>
					<Form.Item
						label="Mã môn"
						name="maMon"
						rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
					>
						<Input placeholder="VD: MH001" />
					</Form.Item>
					<Form.Item
						label="Tên môn học"
						name="tenMon"
						rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
					>
						<Input placeholder="VD: Lập trình hướng đối tượng" />
					</Form.Item>
					<Form.Item
						label="Số tín chỉ"
						name="soTinChi"
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
					>
						<InputNumber min={1} max={10} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default MonHocPage;
