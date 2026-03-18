import {
	Button, Card, Form, Input, message, Modal, Popconfirm,
	Select, Space, Table, Tag, Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
	CauHoi,
	generateId,
	getCauHois,
	getKhoiKienThucs,
	getMonHocs,
	MUC_DO_KHO_COLOR,
	MUC_DO_KHO_LABEL,
	MucDoKho,
	saveCauHois,
} from '../data';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ALL_MUC_DO: MucDoKho[] = ['De', 'TrungBinh', 'Kho', 'RatKho'];

const CauHoiPage: React.FC = () => {
	const monHocs = getMonHocs();
	const khoiKienThucs = getKhoiKienThucs();

	const [data, setData] = useState<CauHoi[]>(getCauHois);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<CauHoi | null>(null);
	const [form] = Form.useForm();

	// Filter state
	const [filterMon, setFilterMon] = useState<string | undefined>(undefined);
	const [filterMucDo, setFilterMucDo] = useState<MucDoKho | undefined>(undefined);
	const [filterKhoi, setFilterKhoi] = useState<string | undefined>(undefined);

	const persist = (next: CauHoi[]) => {
		setData(next);
		saveCauHois(next);
	};

	const openAdd = () => {
		setEditing(null);
		form.resetFields();
		setModalOpen(true);
	};

	const openEdit = (record: CauHoi) => {
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
		message.success('Đã xoá câu hỏi!');
	};

	const handleOk = () => {
		form.validateFields().then((values) => {
			if (editing) {
				persist(data.map((d) => (d.id === editing.id ? { ...editing, ...values } : d)));
				message.success('Cập nhật thành công!');
			} else {
				const newItem: CauHoi = { id: generateId(), ...values };
				persist([...data, newItem]);
				message.success('Thêm mới thành công!');
			}
			setModalOpen(false);
		});
	};

	const getMonTen = useCallback((id: string) => monHocs.find((m) => m.id === id)?.tenMon || id, []);
	const getKhoiTen = useCallback((id: string) => khoiKienThucs.find((k) => k.id === id)?.tenKhoi || id, []);

	const filtered = data.filter((item) => {
		if (filterMon && item.monHocId !== filterMon) return false;
		if (filterMucDo && item.mucDoKho !== filterMucDo) return false;
		if (filterKhoi && item.khoiKienThucId !== filterKhoi) return false;
		return true;
	});

	const columns = [
		{ title: 'Mã câu hỏi', dataIndex: 'maCauHoi', key: 'maCauHoi', width: 120 },
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			width: 200,
			render: (id: string) => getMonTen(id),
		},
		{
			title: 'Nội dung câu hỏi',
			dataIndex: 'noiDung',
			key: 'noiDung',
			ellipsis: true,
		},
		{
			title: 'Mức độ khó',
			dataIndex: 'mucDoKho',
			key: 'mucDoKho',
			width: 130,
			render: (val: MucDoKho) => (
				<Tag color={MUC_DO_KHO_COLOR[val]}>{MUC_DO_KHO_LABEL[val]}</Tag>
			),
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoiKienThucId',
			key: 'khoiKienThucId',
			width: 140,
			render: (id: string) => getKhoiTen(id),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 140,
			render: (_: any, record: CauHoi) => (
				<Space>
					<Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>Sửa</Button>
					<Popconfirm title="Xác nhận xoá?" onConfirm={() => handleDelete(record.id)} okText="Xoá" cancelText="Huỷ">
						<Button type="link" danger icon={<DeleteOutlined />}>Xoá</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Title level={3} style={{ margin: 0 }}>Quản lý câu hỏi</Title>
				<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm câu hỏi</Button>
			</div>

			{/* Bộ lọc tìm kiếm */}
			<Card style={{ marginBottom: 16 }}>
				<Space wrap>
					<SearchOutlined style={{ color: '#1890ff' }} />
					<Select
						allowClear
						placeholder="Lọc theo môn học"
						style={{ width: 200 }}
						value={filterMon}
						onChange={setFilterMon}
					>
						{monHocs.map((m) => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
					</Select>
					<Select
						allowClear
						placeholder="Lọc theo mức độ khó"
						style={{ width: 180 }}
						value={filterMucDo}
						onChange={setFilterMucDo}
					>
						{ALL_MUC_DO.map((m) => (
							<Option key={m} value={m}>
								<Tag color={MUC_DO_KHO_COLOR[m]}>{MUC_DO_KHO_LABEL[m]}</Tag>
							</Option>
						))}
					</Select>
					<Select
						allowClear
						placeholder="Lọc theo khối kiến thức"
						style={{ width: 200 }}
						value={filterKhoi}
						onChange={setFilterKhoi}
					>
						{khoiKienThucs.map((k) => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
					</Select>
					{(filterMon || filterMucDo || filterKhoi) && (
						<Button onClick={() => { setFilterMon(undefined); setFilterMucDo(undefined); setFilterKhoi(undefined); }}>
							Xoá bộ lọc
						</Button>
					)}
					<span style={{ color: '#888' }}>Kết quả: <strong>{filtered.length}</strong> câu hỏi</span>
				</Space>
			</Card>

			<Card>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={filtered}
					pagination={{ pageSize: 10 }}
					bordered
					size="middle"
				/>
			</Card>

			<Modal
				title={editing ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
				visible={modalOpen}
				onOk={handleOk}
				onCancel={() => setModalOpen(false)}
				okText={editing ? 'Cập nhật' : 'Thêm mới'}
				cancelText="Huỷ"
				width={640}
			>
				<Form form={form} layout="vertical" style={{ marginTop: 16 }}>
					<Form.Item label="Mã câu hỏi" name="maCauHoi" rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi!' }]}>
						<Input placeholder="VD: CH001" />
					</Form.Item>
					<Form.Item label="Môn học" name="monHocId" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder="Chọn môn học">
							{monHocs.map((m) => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
						</Select>
					</Form.Item>
					<Form.Item label="Nội dung câu hỏi" name="noiDung" rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}>
						<TextArea rows={3} placeholder="Nhập nội dung câu hỏi tự luận..." />
					</Form.Item>
					<Form.Item label="Mức độ khó" name="mucDoKho" rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}>
						<Select placeholder="Chọn mức độ khó">
							{ALL_MUC_DO.map((m) => (
								<Option key={m} value={m}><Tag color={MUC_DO_KHO_COLOR[m]}>{MUC_DO_KHO_LABEL[m]}</Tag></Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="Khối kiến thức" name="khoiKienThucId" rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}>
						<Select placeholder="Chọn khối kiến thức">
							{khoiKienThucs.map((k) => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default CauHoiPage;
