import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;

type OrderStatus = 'CHO_XAC_NHAN' | 'DANG_GIAO' | 'HOAN_THANH' | 'HUY';

interface Customer {
	id: string;
	name: string;
}

interface Product {
	id: string;
	name: string;
	price: number;
}

interface Order {
	id: string;
	code: string;
	customerId: string;
	productIds: string[];
	orderDate: string;
	status: OrderStatus;
}

interface OrderFormValues {
	code: string;
	customerId: string;
	productIds: string[];
	orderDate: moment.Moment;
	status: OrderStatus;
}

const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
const TEN_DEM = ['Văn', 'Thị', 'Minh', 'Gia', 'Quốc', 'Thanh', 'Anh', 'Ngọc', 'Đức', 'Hải'];
const TEN = ['An', 'Bình', 'Cường', 'Duy', 'Hà', 'Hiếu', 'Khánh', 'Lam', 'Nam', 'Phương'];

const CUSTOMERS: Customer[] = Array.from({ length: 100 }, (_, index) => {
	const i = index + 1;
	const id = `C${String(i).padStart(3, '0')}`;
	const ho = HO[Math.floor(index / TEN_DEM.length) % HO.length];
	const tenDem = TEN_DEM[index % TEN_DEM.length];
	const ten = TEN[(index + Math.floor(index / HO.length)) % TEN.length];

	return {
		id,
		name: `${ho} ${tenDem} ${ten}`,
	};
});

const PRODUCTS: Product[] = [
	{ id: 'P001', name: 'Áo sơ mi', price: 320000 },
	{ id: 'P002', name: 'Quần jean', price: 450000 },
	{ id: 'P003', name: 'Giày thể thao', price: 790000 },
	{ id: 'P004', name: 'Túi xách', price: 560000 },
	{ id: 'P005', name: 'Thắt lưng da', price: 210000 },
];

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; color: string }> = [
	{ value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận', color: 'processing' },
	{ value: 'DANG_GIAO', label: 'Đang giao', color: 'blue' },
	{ value: 'HOAN_THANH', label: 'Hoàn thành', color: 'success' },
	{ value: 'HUY', label: 'Hủy', color: 'error' },
];

const getStatusMeta = (status: OrderStatus) =>
	STATUS_OPTIONS.find((item) => item.value === status) || STATUS_OPTIONS[0];

const formatMoney = (value: number) =>
	new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(value);

const QuanLyDonHang: React.FC = () => {
	const [form] = Form.useForm<OrderFormValues>();
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([
		{
			id: 'ODR-1',
			code: 'DH001',
			customerId: 'C001',
			productIds: ['P001', 'P003'],
			orderDate: '2026-04-14',
			status: 'CHO_XAC_NHAN',
		},
		{
			id: 'ODR-2',
			code: 'DH002',
			customerId: 'C003',
			productIds: ['P002', 'P005'],
			orderDate: '2026-04-11',
			status: 'DANG_GIAO',
		},
		{
			id: 'ODR-3',
			code: 'DH003',
			customerId: 'C002',
			productIds: ['P004'],
			orderDate: '2026-04-10',
			status: 'HOAN_THANH',
		},
		{
			id: 'ODR-4',
			code: 'DH004',
			customerId: 'C005',
			productIds: ['P001', 'P002'],
			orderDate: '2026-04-09',
			status: 'CHO_XAC_NHAN',
		},
		{
			id: 'ODR-5',
			code: 'DH005',
			customerId: 'C008',
			productIds: ['P003'],
			orderDate: '2026-04-08',
			status: 'DANG_GIAO',
		},
		{
			id: 'ODR-6',
			code: 'DH006',
			customerId: 'C010',
			productIds: ['P005', 'P004'],
			orderDate: '2026-04-07',
			status: 'HOAN_THANH',
		},
		{
			id: 'ODR-7',
			code: 'DH007',
			customerId: 'C012',
			productIds: ['P002', 'P003'],
			orderDate: '2026-04-06',
			status: 'HUY',
		},
		{
			id: 'ODR-8',
			code: 'DH008',
			customerId: 'C015',
			productIds: ['P001', 'P005'],
			orderDate: '2026-04-05',
			status: 'CHO_XAC_NHAN',
		},
		{
			id: 'ODR-9',
			code: 'DH009',
			customerId: 'C020',
			productIds: ['P004', 'P003'],
			orderDate: '2026-04-04',
			status: 'DANG_GIAO',
		},
		{
			id: 'ODR-10',
			code: 'DH010',
			customerId: 'C025',
			productIds: ['P002'],
			orderDate: '2026-04-03',
			status: 'HOAN_THANH',
		},
		{
			id: 'ODR-11',
			code: 'DH011',
			customerId: 'C030',
			productIds: ['P001', 'P002', 'P005'],
			orderDate: '2026-04-02',
			status: 'CHO_XAC_NHAN',
		},
		{
			id: 'ODR-12',
			code: 'DH012',
			customerId: 'C038',
			productIds: ['P003', 'P004'],
			orderDate: '2026-04-01',
			status: 'HUY',
		},
		{
			id: 'ODR-13',
			code: 'DH013',
			customerId: 'C042',
			productIds: ['P002', 'P004', 'P005'],
			orderDate: '2026-03-31',
			status: 'DANG_GIAO',
		},
		{
			id: 'ODR-14',
			code: 'DH014',
			customerId: 'C057',
			productIds: ['P001'],
			orderDate: '2026-03-30',
			status: 'HOAN_THANH',
		},
		{
			id: 'ODR-15',
			code: 'DH015',
			customerId: 'C073',
			productIds: ['P003', 'P005'],
			orderDate: '2026-03-29',
			status: 'CHO_XAC_NHAN',
		},
	]);

	const selectedProductIds = Form.useWatch('productIds', form) || [];

	const productMap = useMemo(
		() => PRODUCTS.reduce((acc, item) => ({ ...acc, [item.id]: item }), {} as Record<string, Product>),
		[],
	);

	const customerMap = useMemo(
		() => CUSTOMERS.reduce((acc, item) => ({ ...acc, [item.id]: item }), {} as Record<string, Customer>),
		[],
	);

	const getOrderTotal = (productIds: string[]) =>
		productIds.reduce((sum, productId) => sum + (productMap[productId]?.price || 0), 0);

	const displayedOrders = useMemo(() => {
		const keyword = searchKeyword.trim().toLowerCase();
		return orders.filter((order) => {
			const customerName = customerMap[order.customerId]?.name?.toLowerCase() || '';
			const matchedKeyword =
				!keyword || order.code.toLowerCase().includes(keyword) || customerName.includes(keyword);
			const matchedStatus = statusFilter === 'ALL' || order.status === statusFilter;
			return matchedKeyword && matchedStatus;
		});
	}, [customerMap, orders, searchKeyword, statusFilter]);

	const stats = useMemo(() => {
		const totalRevenue = displayedOrders.reduce((sum, order) => sum + getOrderTotal(order.productIds), 0);
		return {
			total: displayedOrders.length,
			pending: displayedOrders.filter((item) => item.status === 'CHO_XAC_NHAN').length,
			shipping: displayedOrders.filter((item) => item.status === 'DANG_GIAO').length,
			completed: displayedOrders.filter((item) => item.status === 'HOAN_THANH').length,
			totalRevenue,
		};
	}, [displayedOrders]);

	const openCreateModal = () => {
		setEditingOrderId(null);
		form.setFieldsValue({
			code: '',
			customerId: undefined,
			productIds: [],
			orderDate: moment(),
			status: 'CHO_XAC_NHAN',
		});
		setIsModalOpen(true);
	};

	const openEditModal = (order: Order) => {
		setEditingOrderId(order.id);
		form.setFieldsValue({
			code: order.code,
			customerId: order.customerId,
			productIds: order.productIds,
			orderDate: moment(order.orderDate, 'YYYY-MM-DD'),
			status: order.status,
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		form.resetFields();
	};

	const handleSaveOrder = async () => {
		const values = await form.validateFields();
		const normalizedCode = values.code.trim().toUpperCase();

		const duplicated = orders.some(
			(order) =>
				order.code.trim().toUpperCase() === normalizedCode &&
				(editingOrderId ? order.id !== editingOrderId : true),
		);

		if (duplicated) {
			form.setFields([
				{
					name: 'code',
					errors: ['Mã đơn hàng đã tồn tại, vui lòng nhập mã khác.'],
				},
			]);
			return;
		}

		const payload: Order = {
			id: editingOrderId || `ODR-${Date.now()}`,
			code: normalizedCode,
			customerId: values.customerId,
			productIds: values.productIds,
			orderDate: values.orderDate.format('YYYY-MM-DD'),
			status: values.status,
		};

		if (editingOrderId) {
			setOrders((prev) => prev.map((item) => (item.id === editingOrderId ? payload : item)));
			message.success('Cập nhật đơn hàng thành công.');
		} else {
			setOrders((prev) => [payload, ...prev]);
			message.success('Thêm đơn hàng thành công.');
		}

		closeModal();
	};

	const handleCancelOrder = (orderId: string) => {
		setOrders((prev) =>
			prev.map((item) => (item.id === orderId ? { ...item, status: 'HUY' as OrderStatus } : item)),
		);
		message.success('Đơn hàng đã được hủy.');
	};

	const columns: ColumnsType<Order> = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'code',
			key: 'code',
			sorter: (a, b) => a.code.localeCompare(b.code),
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerId',
			key: 'customerId',
			render: (customerId: string) => customerMap[customerId]?.name || customerId,
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'orderDate',
			key: 'orderDate',
			sorter: (a, b) => moment(a.orderDate).valueOf() - moment(b.orderDate).valueOf(),
			render: (orderDate: string) => moment(orderDate).format('DD/MM/YYYY'),
		},
		{
			title: 'Tổng tiền',
			key: 'total',
			sorter: (a, b) => getOrderTotal(a.productIds) - getOrderTotal(b.productIds),
			render: (_, order) => <Text strong>{formatMoney(getOrderTotal(order.productIds))}</Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: OrderStatus) => {
				const statusMeta = getStatusMeta(status);
				return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, order) => (
				<Space>
					<Button size="small" onClick={() => openEditModal(order)}>
						Chỉnh sửa
					</Button>
					{order.status === 'CHO_XAC_NHAN' ? (
						<Popconfirm
							title="Cảnh báo: Bạn chắc chắn muốn hủy đơn hàng này?"
							onConfirm={() => handleCancelOrder(order.id)}
							okText="Đồng ý"
							cancelText="Không"
						>
							<Button size="small" danger>
								Hủy đơn
							</Button>
						</Popconfirm>
					) : (
						<Button size="small" danger disabled>
							Hủy đơn
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div
			style={{
				padding: 24,
				background: 'linear-gradient(180deg, #f4f8ff 0%, #ffffff 260px)',
				minHeight: '100%',
			}}
		>
			<Card
				style={{
					marginBottom: 16,
					borderRadius: 12,
					background: 'linear-gradient(120deg, #0f4c81 0%, #2d7fc1 55%, #59a4e3 100%)',
				}}
				bodyStyle={{ padding: 20 }}
			>
				<Title level={3} style={{ marginBottom: 2, color: '#ffffff' }}>
					Quản lý đơn hàng
				</Title>
				<Text style={{ color: 'rgba(255,255,255,0.9)' }}>
					Danh sách, thêm/sửa và hủy đơn hàng theo điều kiện.
				</Text>
				<div style={{ marginTop: 10, color: '#e7f4ff', fontSize: 13 }}>
					Doanh thu theo bộ lọc hiện tại: <strong>{formatMoney(stats.totalRevenue)}</strong>
				</div>
				<div style={{ marginTop: 4, color: '#e7f4ff', fontSize: 13 }}>
					Tổng khách hàng mẫu: <strong>{CUSTOMERS.length}</strong>
				</div>
			</Card>

			<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 10, background: '#f0f7ff' }}>
						<Statistic title="Tổng đơn" value={stats.total} valueStyle={{ color: '#0f4c81' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 10, background: '#eef8ff' }}>
						<Statistic title="Chờ xác nhận" value={stats.pending} valueStyle={{ color: '#1677ff' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 10, background: '#f3f7ff' }}>
						<Statistic title="Đang giao" value={stats.shipping} valueStyle={{ color: '#2f54eb' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 10, background: '#f6ffed' }}>
						<Statistic title="Hoàn thành" value={stats.completed} valueStyle={{ color: '#389e0d' }} />
					</Card>
				</Col>
			</Row>

			<Card style={{ borderRadius: 12 }}>
				<Space direction="vertical" size={16} style={{ width: '100%' }}>
					<div style={{ background: '#fafcff', padding: 12, borderRadius: 10, border: '1px solid #e8f0fb' }}>
						<Space wrap>
						<Input.Search
							allowClear
							placeholder="Tìm theo mã đơn hàng hoặc khách hàng"
							style={{ width: 320 }}
							onChange={(event) => setSearchKeyword(event.target.value)}
						/>
						<Select
							value={statusFilter}
							style={{ width: 220 }}
							onChange={(value: OrderStatus | 'ALL') => setStatusFilter(value)}
							options={[
								{ value: 'ALL', label: 'Tất cả trạng thái' },
								...STATUS_OPTIONS.map((item) => ({ value: item.value, label: item.label })),
							]}
						/>
						<Button type="primary" onClick={openCreateModal} style={{ boxShadow: '0 6px 18px rgba(22,119,255,0.2)' }}>
							Thêm đơn hàng
						</Button>
						</Space>
					</div>

					<Table
						rowKey="id"
						columns={columns}
						dataSource={displayedOrders}
						pagination={false}
						bordered
						size="middle"
						scroll={{ x: 980 }}
					/>
				</Space>
			</Card>

			<Modal
				title={editingOrderId ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
				visible={isModalOpen}
				onCancel={closeModal}
				onOk={handleSaveOrder}
				okText={editingOrderId ? 'Lưu thay đổi' : 'Tạo đơn hàng'}
				cancelText="Đóng"
				destroyOnClose
			>
				<Form form={form} layout="vertical" preserve={false}>
					<Form.Item
						label="Mã đơn hàng"
						name="code"
						rules={[
							{ required: true, whitespace: true, message: 'Vui lòng nhập mã đơn hàng.' },
						]}
					>
						<Input placeholder="VD: DH004" maxLength={20} />
					</Form.Item>

					<Form.Item
						label="Khách hàng"
						name="customerId"
						rules={[{ required: true, message: 'Vui lòng chọn khách hàng.' }]}
					>
						<Select
							showSearch
							placeholder="Chọn khách hàng"
							optionFilterProp="label"
							options={CUSTOMERS.map((item) => ({
								value: item.id,
								label: `${item.id} - ${item.name}`,
							}))}
						/>
					</Form.Item>

					<Form.Item
						label="Sản phẩm trong đơn"
						name="productIds"
						rules={[
							{ required: true, type: 'array', min: 1, message: 'Vui lòng chọn ít nhất 1 sản phẩm.' },
						]}
					>
						<Select
							mode="multiple"
							placeholder="Chọn 1 hoặc nhiều sản phẩm"
							optionFilterProp="label"
							options={PRODUCTS.map((item) => ({
								value: item.id,
								label: `${item.name} (${formatMoney(item.price)})`,
							}))}
						/>
					</Form.Item>

					<Form.Item label="Tổng tiền tạm tính">
						<Text strong>{formatMoney(getOrderTotal(selectedProductIds))}</Text>
					</Form.Item>

					<Form.Item
						label="Ngày đặt hàng"
						name="orderDate"
						rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng.' }]}
					>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>

					<Form.Item
						label="Trạng thái đơn hàng"
						name="status"
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
					>
						<Select
							options={STATUS_OPTIONS.map((item) => ({
								value: item.value,
								label: item.label,
							}))}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyDonHang;
