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
	Select,
	Space,
	Table,
	Tag,
	message,
	Empty,
	Skeleton,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import type { Moment } from 'moment';
import type { ExerciseType, WorkoutLog } from '@/models/fitness';
import { getWorkoutLogs, createWorkoutLog, updateWorkoutLog, deleteWorkoutLog } from '@/services/fitness';
import styles from './index.less';

type ExerciseTypeOption = {
	label: string;
	value: ExerciseType;
};

const EXERCISE_TYPES: ExerciseTypeOption[] = [
	{ label: 'Cardio', value: 'CARDIO' },
	{ label: 'Sức mạnh', value: 'STRENGTH' },
	{ label: 'Yoga', value: 'YOGA' },
	{ label: 'HIIT', value: 'HIIT' },
	{ label: 'Khác', value: 'OTHER' },
];

const STATUS_OPTIONS = [
	{ label: 'Hoàn thành', value: 'COMPLETED' },
	{ label: 'Bỏ lỡ', value: 'MISSED' },
];

interface WorkoutFormValues {
	date: Moment;
	exerciseType: ExerciseType;
	duration: number;
	calories: number;
	notes: string;
	status: 'COMPLETED' | 'MISSED';
}

export default function WorkoutJournal() {
	const [form] = Form.useForm();
	const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [dateRange, setDateRange] = useState<[Moment | null, Moment | null] | null>(null);
	const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchWorkouts();
	}, []);

	const fetchWorkouts = async () => {
		setLoading(true);
		try {
			const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
			const endDate = dateRange?.[1]?.format('YYYY-MM-DD');
			const data = await getWorkoutLogs(startDate, endDate, selectedType);
			setWorkouts(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	const handleAddWorkout = () => {
		setEditingId(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEditWorkout = (record: WorkoutLog) => {
		setEditingId(record.id);
		form.setFieldsValue({
			date: moment(record.date),
			exerciseType: record.exerciseType,
			duration: record.duration,
			calories: record.calories,
			notes: record.notes,
			status: record.status,
		});
		setModalVisible(true);
	};

	const handleDeleteWorkout = async (id: string) => {
		try {
			await deleteWorkoutLog(id);
			message.success('Xóa buổi tập thành công');
			fetchWorkouts();
		} catch (error) {
			message.error('Lỗi khi xóa buổi tập');
		}
	};

	const handleModalOk = async () => {
		try {
			const values: WorkoutFormValues = await form.validateFields();
			const data = {
				date: values.date.format('YYYY-MM-DD'),
				exerciseType: values.exerciseType,
				duration: values.duration,
				calories: values.calories,
				notes: values.notes,
				status: values.status,
			};

			if (editingId) {
				await updateWorkoutLog(editingId, data);
				message.success('Cập nhật buổi tập thành công');
			} else {
				await createWorkoutLog(data);
				message.success('Thêm buổi tập thành công');
			}

			setModalVisible(false);
			fetchWorkouts();
		} catch (error: any) {
			message.error(error?.message || 'Lỗi khi lưu dữ liệu');
		}
	};

	const filteredWorkouts = workouts.filter((w) => {
		if (searchText && !EXERCISE_TYPES.find((t) => t.value === w.exerciseType)?.label.toLowerCase().includes(searchText.toLowerCase())) {
			return false;
		}
		return true;
	});

	const columns: ColumnsType<WorkoutLog> = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			render: (text) => moment(text).format('DD/MM/YYYY'),
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'exerciseType',
			key: 'exerciseType',
			render: (type: ExerciseType) => {
				const exerciseType = EXERCISE_TYPES.find((t) => t.value === type);
				return exerciseType ? exerciseType.label : type;
			},
			filters: EXERCISE_TYPES.map((t) => ({ text: t.label, value: t.value })),
			onFilter: (value, record) => record.exerciseType === value,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
			sorter: (a, b) => a.duration - b.duration,
		},
		{
			title: 'Calo đốt',
			dataIndex: 'calories',
			key: 'calories',
			render: (calories) => `${calories} kcal`,
			sorter: (a, b) => a.calories - b.calories,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'notes',
			key: 'notes',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={status === 'COMPLETED' ? 'green' : 'red'}>
					{status === 'COMPLETED' ? 'Hoàn thành' : 'Bỏ lỡ'}
				</Tag>
			),
			filters: STATUS_OPTIONS.map((s) => ({ text: s.label, value: s.value })),
			onFilter: (value, record) => record.status === value,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size="small">
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditWorkout(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa buổi tập" description="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDeleteWorkout(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className={styles.workoutJournal}>
			<Card>
				{/* Filters */}
				<Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
					<Col xs={24} sm={12} lg={6}>
						<Input.Search
							placeholder="Tìm kiếm bài tập..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Select
							placeholder="Chọn loại bài tập"
							allowClear
							options={EXERCISE_TYPES}
							value={selectedType}
							onChange={(value) => setSelectedType(value)}
						/>
					</Col>
					<Col xs={24} sm={24} lg={12}>
						<DatePicker.RangePicker
							style={{ width: '100%' }}
							placeholder={['Từ ngày', 'Đến ngày']}
							onChange={(dates) => {
								setDateRange(dates as [Moment | null, Moment | null]);
							}}
						/>
					</Col>
				</Row>

				<Row style={{ marginBottom: '16px' }}>
					<Space>
						<Button type="primary" icon={<PlusOutlined />} onClick={handleAddWorkout}>
							Thêm buổi tập
						</Button>
						<Button onClick={fetchWorkouts}>Tải lại</Button>
					</Space>
				</Row>

				{/* Table */}
				{loading ? (
					<Skeleton active paragraph={{ rows: 6 }} />
				) : filteredWorkouts.length > 0 ? (
					<Table columns={columns} dataSource={filteredWorkouts} rowKey="id" pagination={{ pageSize: 10 }} />
				) : (
					<Empty description="Chưa có buổi tập nào" />
				)}
			</Card>

			{/* Modal Form */}
			<Modal
				title={editingId ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={() => setModalVisible(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="exerciseType" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
						<Select options={EXERCISE_TYPES} placeholder="Chọn loại bài tập" />
					</Form.Item>
					<Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="calories" label="Calo đốt" rules={[{ required: true, message: 'Vui lòng nhập calo đốt' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="notes" label="Ghi chú">
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select options={STATUS_OPTIONS} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
