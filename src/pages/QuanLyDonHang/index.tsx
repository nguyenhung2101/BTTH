import {
	Button,
	Card,
	DatePicker,
	Form,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
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

const CUSTOMERS: Customer[] = [
	{ id: 'C001', name: 'Nguyen Van An' },
	{ id: 'C002', name: 'Tran Thi Binh' },
	{ id: 'C003', name: 'Le Quoc Cuong' },
	{ id: 'C004', name: 'Pham Minh Chau' },
];

const PRODUCTS: Product[] = [
	{ id: 'P001', name: 'Ao so mi', price: 320000 },
	{ id: 'P002', name: 'Quan jean', price: 450000 },
	{ id: 'P003', name: 'Giay the thao', price: 790000 },
	{ id: 'P004', name: 'Tui xach', price: 560000 },
	{ id: 'P005', name: 'That lung da', price: 210000 },
];

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; color: string }> = [
	{ value: 'CHO_XAC_NHAN', label: 'Cho xac nhan', color: 'processing' },
	{ value: 'DANG_GIAO', label: 'Dang giao', color: 'blue' },
	{ value: 'HOAN_THANH', label: 'Hoan thanh', color: 'success' },
	{ value: 'HUY', label: 'Huy', color: 'error' },
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
					errors: ['Ma don hang da ton tai, vui long nhap ma khac.'],
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
			message.success('Cap nhat don hang thanh cong.');
		} else {
			setOrders((prev) => [payload, ...prev]);
			message.success('Them don hang thanh cong.');
		}

		closeModal();
	};

	const handleCancelOrder = (orderId: string) => {
		setOrders((prev) =>
			prev.map((item) => (item.id === orderId ? { ...item, status: 'HUY' as OrderStatus } : item)),
		);
		message.success('Don hang da duoc huy.');
	};

	const columns: ColumnsType<Order> = [
		{
			title: 'Ma don hang',
			dataIndex: 'code',
			key: 'code',
			sorter: (a, b) => a.code.localeCompare(b.code),
		},
		{
			title: 'Khach hang',
			dataIndex: 'customerId',
			key: 'customerId',
			render: (customerId: string) => customerMap[customerId]?.name || customerId,
		},
		{
			title: 'Ngay dat hang',
			dataIndex: 'orderDate',
			key: 'orderDate',
			sorter: (a, b) => moment(a.orderDate).valueOf() - moment(b.orderDate).valueOf(),
			render: (orderDate: string) => moment(orderDate).format('DD/MM/YYYY'),
		},
		{
			title: 'Tong tien',
			key: 'total',
			sorter: (a, b) => getOrderTotal(a.productIds) - getOrderTotal(b.productIds),
			render: (_, order) => <Text strong>{formatMoney(getOrderTotal(order.productIds))}</Text>,
		},
		{
			title: 'Trang thai',
			dataIndex: 'status',
			key: 'status',
			render: (status: OrderStatus) => {
				const statusMeta = getStatusMeta(status);
				return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
			},
		},
		{
			title: 'Thao tac',
			key: 'actions',
			render: (_, order) => (
				<Space>
					<Button size="small" onClick={() => openEditModal(order)}>
						Chinh sua
					</Button>
					{order.status === 'CHO_XAC_NHAN' ? (
						<Popconfirm
							title="Canh bao: Ban chac chan muon huy don hang nay?"
							onConfirm={() => handleCancelOrder(order.id)}
							okText="Dong y"
							cancelText="Khong"
						>
							<Button size="small" danger>
								Huy don
							</Button>
						</Popconfirm>
					) : (
						<Button size="small" danger disabled>
							Huy don
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card>
				<Space direction="vertical" size={16} style={{ width: '100%' }}>
					<div>
						<Title level={3} style={{ marginBottom: 0 }}>
							Quan ly don hang
						</Title>
						<Text type="secondary">
							Danh sach, them/sua va huy don hang theo dieu kien.
						</Text>
					</div>

					<Space wrap>
						<Input.Search
							allowClear
							placeholder="Tim theo ma don hang hoac khach hang"
							style={{ width: 320 }}
							onChange={(event) => setSearchKeyword(event.target.value)}
						/>
						<Select
							value={statusFilter}
							style={{ width: 220 }}
							onChange={(value: OrderStatus | 'ALL') => setStatusFilter(value)}
							options={[
								{ value: 'ALL', label: 'Tat ca trang thai' },
								...STATUS_OPTIONS.map((item) => ({ value: item.value, label: item.label })),
							]}
						/>
						<Button type="primary" onClick={openCreateModal}>
							Them don hang
						</Button>
					</Space>

					<Table
						rowKey="id"
						columns={columns}
						dataSource={displayedOrders}
						pagination={{ pageSize: 6 }}
						scroll={{ x: 980 }}
					/>
				</Space>
			</Card>

			<Modal
				title={editingOrderId ? 'Chinh sua don hang' : 'Them don hang'}
				visible={isModalOpen}
				onCancel={closeModal}
				onOk={handleSaveOrder}
				okText={editingOrderId ? 'Luu thay doi' : 'Tao don hang'}
				cancelText="Dong"
				destroyOnClose
			>
				<Form form={form} layout="vertical" preserve={false}>
					<Form.Item
						label="Ma don hang"
						name="code"
						rules={[
							{ required: true, whitespace: true, message: 'Vui long nhap ma don hang.' },
						]}
					>
						<Input placeholder="VD: DH004" maxLength={20} />
					</Form.Item>

					<Form.Item
						label="Khach hang"
						name="customerId"
						rules={[{ required: true, message: 'Vui long chon khach hang.' }]}
					>
						<Select
							showSearch
							placeholder="Chon khach hang"
							optionFilterProp="label"
							options={CUSTOMERS.map((item) => ({
								value: item.id,
								label: `${item.id} - ${item.name}`,
							}))}
						/>
					</Form.Item>

					<Form.Item
						label="San pham trong don"
						name="productIds"
						rules={[
							{ required: true, type: 'array', min: 1, message: 'Vui long chon it nhat 1 san pham.' },
						]}
					>
						<Select
							mode="multiple"
							placeholder="Chon 1 hoac nhieu san pham"
							optionFilterProp="label"
							options={PRODUCTS.map((item) => ({
								value: item.id,
								label: `${item.name} (${formatMoney(item.price)})`,
							}))}
						/>
					</Form.Item>

					<Form.Item label="Tong tien tam tinh">
						<Text strong>{formatMoney(getOrderTotal(selectedProductIds))}</Text>
					</Form.Item>

					<Form.Item
						label="Ngay dat hang"
						name="orderDate"
						rules={[{ required: true, message: 'Vui long chon ngay dat hang.' }]}
					>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>

					<Form.Item
						label="Trang thai don hang"
						name="status"
						rules={[{ required: true, message: 'Vui long chon trang thai.' }]}
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
