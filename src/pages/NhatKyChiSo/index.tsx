import {
	Button,
	Card,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Col,
	Table,
	Tag,
	Space,
	message,
	Empty,
	Skeleton,
	Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import type { Moment } from 'moment';
import type { HealthMetrics, BMICategory } from '@/models/fitness';
import {
	getHealthMetrics,
	createHealthMetrics,
	updateHealthMetrics,
	deleteHealthMetrics,
	calculateBMI,
	getBMIInfo,
} from '@/services/fitness';
import styles from './index.less';

interface HealthMetricsFormValues {
	date: Moment;
	weight: number;
	height: number;
	restingHeartRate: number;
	sleepHours: number;
}

export default function HealthMetricsPage() {
	const [form] = Form.useForm();
	const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<[Moment | null, Moment | null] | null>(null);

	useEffect(() => {
		fetchMetrics();
	}, []);

	const fetchMetrics = async () => {
		setLoading(true);
		try {
			const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
			const endDate = dateRange?.[1]?.format('YYYY-MM-DD');
			const data = await getHealthMetrics(startDate, endDate);
			setMetrics(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	const handleAddMetrics = () => {
		setEditingId(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEditMetrics = (record: HealthMetrics) => {
		setEditingId(record.id);
		form.setFieldsValue({
			date: moment(record.date),
			weight: record.weight,
			height: record.height,
			restingHeartRate: record.restingHeartRate,
			sleepHours: record.sleepHours,
		});
		setModalVisible(true);
	};

	const handleDeleteMetrics = async (id: string) => {
		try {
			await deleteHealthMetrics(id);
			message.success('Xóa chỉ số sức khỏe thành công');
			fetchMetrics();
		} catch (error) {
			message.error('Lỗi khi xóa chỉ số sức khỏe');
		}
	};

	const handleModalOk = async () => {
		try {
			const values: HealthMetricsFormValues = await form.validateFields();
			const data = {
				date: values.date.format('YYYY-MM-DD'),
				weight: values.weight,
				height: values.height,
				restingHeartRate: values.restingHeartRate,
				sleepHours: values.sleepHours,
			};

			if (editingId) {
				await updateHealthMetrics(editingId, data);
				message.success('Cập nhật chỉ số sức khỏe thành công');
			} else {
				await createHealthMetrics(data);
				message.success('Thêm chỉ số sức khỏe thành công');
			}

			setModalVisible(false);
			fetchMetrics();
		} catch (error: any) {
			message.error(error?.message || 'Lỗi khi lưu dữ liệu');
		}
	};

	const getBMIColorForCategory = (category: BMICategory): string => {
		const colorMap: Record<BMICategory, string> = {
			UNDERWEIGHT: 'blue',
			NORMAL: 'green',
			OVERWEIGHT: 'gold',
			OBESE: 'red',
		};
		return colorMap[category] || 'default';
	};

	const getBMICategoryLabel = (category: BMICategory): string => {
		const labelMap: Record<BMICategory, string> = {
			UNDERWEIGHT: 'Thiếu cân',
			NORMAL: 'Bình thường',
			OVERWEIGHT: 'Thừa cân',
			OBESE: 'Béo phì',
		};
		return labelMap[category] || category;
	};

	const columns: ColumnsType<HealthMetrics> = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			render: (text) => moment(text).format('DD/MM/YYYY'),
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
		},
		{
			title: 'Cân nặng (kg)',
			dataIndex: 'weight',
			key: 'weight',
			render: (weight) => `${weight} kg`,
			sorter: (a, b) => a.weight - b.weight,
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'height',
			key: 'height',
			render: (height) => `${height} cm`,
		},
		{
			title: 'BMI',
			key: 'bmi',
			render: (_, record) => {
				if (!record.bmi || !record.bmiCategory) return '-';
				const bmiInfo = getBMIInfo(record.bmi);
				return (
					<Tooltip
						title={
							<>
								<div>
									<strong>BMI Classification:</strong>
								</div>
								<div>Thiếu cân: &lt; 18.5</div>
								<div>Bình thường: 18.5 - 24.9</div>
								<div>Thừa cân: 25 - 29.9</div>
								<div>Béo phì: ≥ 30</div>
							</>
						}
					>
						<Tag color={getBMIColorForCategory(record.bmiCategory)}>
							{record.bmi} ({getBMICategoryLabel(record.bmiCategory)})
						</Tag>
					</Tooltip>
				);
			},
			sorter: (a, b) => (a.bmi || 0) - (b.bmi || 0),
		},
		{
			title: 'Nhịp tim lúc nghỉ (bpm)',
			dataIndex: 'restingHeartRate',
			key: 'restingHeartRate',
			render: (rate) => `${rate} bpm`,
			sorter: (a, b) => a.restingHeartRate - b.restingHeartRate,
		},
		{
			title: 'Giờ ngủ',
			dataIndex: 'sleepHours',
			key: 'sleepHours',
			render: (hours) => `${hours} giờ`,
			sorter: (a, b) => a.sleepHours - b.sleepHours,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size="small">
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditMetrics(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa chỉ số" description="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDeleteMetrics(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className={styles.healthMetrics}>
			<Card>
				{/* Info Card */}
				<Card style={{ marginBottom: '16px', backgroundColor: '#f0f5ff' }}>
					<Space>
						<InfoCircleOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
						<span>BMI = Cân nặng (kg) / (Chiều cao (m))²</span>
					</Space>
				</Card>

				{/* Filters */}
				<Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
					<Col xs={24} sm={24} lg={16}>
						<DatePicker.RangePicker
							style={{ width: '100%' }}
							placeholder={['Từ ngày', 'Đến ngày']}
							onChange={(dates) => {
								setDateRange(dates as [Moment | null, Moment | null]);
							}}
						/>
					</Col>
					<Col xs={24} sm={12} lg={4}>
						<Button onClick={fetchMetrics} block>
							Tải lại
						</Button>
					</Col>
				</Row>

				<Row style={{ marginBottom: '16px' }}>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAddMetrics}>
						Thêm chỉ số sức khỏe
					</Button>
				</Row>

				{/* Table */}
				{loading ? (
					<Skeleton active paragraph={{ rows: 6 }} />
				) : metrics.length > 0 ? (
					<Table columns={columns} dataSource={metrics} rowKey="id" pagination={{ pageSize: 10 }} />
				) : (
					<Empty description="Chưa có chỉ số sức khỏe nào" />
				)}
			</Card>

			{/* Modal Form */}
			<Modal
				title={editingId ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe mới'}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={() => setModalVisible(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
						<InputNumber min={0} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}>
						<InputNumber min={0} step={0.5} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
