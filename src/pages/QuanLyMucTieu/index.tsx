import {
	Button,
	Card,
	Col,
	Row,
	Drawer,
	Form,
	Input,
	InputNumber,
	Select,
	DatePicker,
	Progress,
	Space,
	Popconfirm,
	Tag,
	message,
	Segmented,
	Empty,
	Skeleton,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import type { Moment } from 'moment';
import type { Goal, GoalStatus, GoalType } from '@/models/fitness';
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/services/fitness';
import styles from './index.less';

type GoalTypeOption = {
	label: string;
	value: GoalType;
};

const GOAL_TYPES: GoalTypeOption[] = [
	{ label: 'Giảm cân', value: 'WEIGHT_LOSS' },
	{ label: 'Tăng cơ', value: 'MUSCLE_GAIN' },
	{ label: 'Cải thiện sức bền', value: 'ENDURANCE' },
	{ label: 'Khác', value: 'OTHER' },
];

const GOAL_STATUS_OPTIONS = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Đang thực hiện', value: 'IN_PROGRESS' },
	{ label: 'Đã đạt', value: 'COMPLETED' },
	{ label: 'Đã hủy', value: 'CANCELLED' },
];

interface GoalFormValues {
	name: string;
	type: GoalType;
	targetValue: number;
	currentValue: number;
	deadline: Moment;
	status: GoalStatus;
}

export default function GoalManagement() {
	const [form] = Form.useForm();
	const [goals, setGoals] = useState<Goal[]>([]);
	const [loading, setLoading] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
	const [editingValueId, setEditingValueId] = useState<string | null>(null);
	const [editingValue, setEditingValue] = useState<number | null>(null);

	useEffect(() => {
		fetchGoals();
	}, [statusFilter]);

	const fetchGoals = async () => {
		setLoading(true);
		try {
			const status = statusFilter === 'all' ? undefined : (statusFilter as GoalStatus);
			const data = await getGoals(status);
			setGoals(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	const handleAddGoal = () => {
		setEditingGoal(null);
		form.resetFields();
		setDrawerVisible(true);
	};

	const handleEditGoal = (goal: Goal) => {
		setEditingGoal(goal);
		form.setFieldsValue({
			name: goal.name,
			type: goal.type,
			targetValue: goal.targetValue,
			currentValue: goal.currentValue,
			deadline: moment(goal.deadline),
			status: goal.status,
		});
		setDrawerVisible(true);
	};

	const handleDeleteGoal = async (id: string) => {
		try {
			await deleteGoal(id);
			message.success('Xóa mục tiêu thành công');
			fetchGoals();
		} catch (error) {
			message.error('Lỗi khi xóa mục tiêu');
		}
	};

	const handleDrawerOk = async () => {
		try {
			const values: GoalFormValues = await form.validateFields();
			const data = {
				name: values.name,
				type: values.type,
				targetValue: values.targetValue,
				currentValue: values.currentValue,
				deadline: values.deadline.format('YYYY-MM-DD'),
				status: values.status,
			};

			if (editingGoal) {
				await updateGoal(editingGoal.id, data);
				message.success('Cập nhật mục tiêu thành công');
			} else {
				await createGoal(data);
				message.success('Thêm mục tiêu thành công');
			}

			setDrawerVisible(false);
			fetchGoals();
		} catch (error: any) {
			message.error(error?.message || 'Lỗi khi lưu dữ liệu');
		}
	};

	const handleUpdateValue = async (goalId: string, newValue: number) => {
		try {
			await updateGoal(goalId, { currentValue: newValue });
			message.success('Cập nhật giá trị hiện tại thành công');
			setEditingValueId(null);
			setEditingValue(null);
			fetchGoals();
		} catch (error) {
			message.error('Lỗi khi cập nhật giá trị');
		}
	};

	const getGoalTypeLabel = (type: GoalType): string => {
		return GOAL_TYPES.find((t) => t.value === type)?.label || type;
	};

	const getStatusColor = (status: GoalStatus): string => {
		const colorMap: Record<GoalStatus, string> = {
			IN_PROGRESS: 'blue',
			COMPLETED: 'green',
			CANCELLED: 'red',
		};
		return colorMap[status] || 'default';
	};

	const getStatusLabel = (status: GoalStatus): string => {
		const labelMap: Record<GoalStatus, string> = {
			IN_PROGRESS: 'Đang thực hiện',
			COMPLETED: 'Đã đạt',
			CANCELLED: 'Đã hủy',
		};
		return labelMap[status] || status;
	};

	const calculateProgress = (current: number, target: number): number => {
		if (target === 0) return 0;
		const progress = (current / target) * 100;
		return Math.min(progress, 100);
	};

	return (
		<div className={styles.goalManagement}>
			<Card>
				{/* Filter */}
				<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
					<Col span={24}>
						<Space>
							<span>Lọc theo trạng thái:</span>
							<Segmented
								options={GOAL_STATUS_OPTIONS}
								value={statusFilter}
								onChange={(value) => setStatusFilter(value as GoalStatus | 'all')}
							/>
						</Space>
					</Col>
				</Row>

				{/* Add Button */}
				<Row style={{ marginBottom: '24px' }}>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal}>
						Thêm mục tiêu mới
					</Button>
				</Row>

				{/* Goals Grid */}
				{loading ? (
					<Skeleton active paragraph={{ rows: 6 }} />
				) : goals.length > 0 ? (
					<Row gutter={[16, 16]}>
						{goals.map((goal) => {
							const progress = calculateProgress(goal.currentValue, goal.targetValue);
							return (
								<Col xs={24} sm={12} lg={8} key={goal.id}>
									<Card className={styles.goalCard} hoverable>
										<Space direction="vertical" style={{ width: '100%' }} size="large">
											{/* Header */}
											<div className={styles.cardHeader}>
												<div>
													<h3 style={{ marginBottom: '4px' }}>{goal.name}</h3>
													<Tag color="blue">{getGoalTypeLabel(goal.type)}</Tag>
													<Tag color={getStatusColor(goal.status)} style={{ marginLeft: '8px' }}>
														{getStatusLabel(goal.status)}
													</Tag>
												</div>
												<Space size="small">
													<Button
														type="primary"
														size="small"
														icon={<EditOutlined />}
														onClick={() => handleEditGoal(goal)}
													>
														Sửa
													</Button>
													<Popconfirm
														title="Xóa mục tiêu"
														description="Bạn có chắc chắn muốn xóa?"
														onConfirm={() => handleDeleteGoal(goal.id)}
													>
														<Button danger size="small" icon={<DeleteOutlined />}>
											Xóa
										</Button>
									</Popconfirm>
								</Space>
							</div>

							{/* Values */}
							<div className={styles.values}>
								<div className={styles.valueRow}>
									<span>Mục tiêu: {goal.targetValue}</span>
								</div>
								<div className={styles.valueRow}>
									<span>Giá trị hiện tại: </span>
									{editingValueId === goal.id ? (
										<InputNumber
											min={0}
											value={editingValue}
											onChange={(val) => setEditingValue(val || 0)}
											onPressEnter={() => {
												if (editingValue !== null) {
													handleUpdateValue(goal.id, editingValue);
												}
											}}
											onBlur={() => {
												setEditingValueId(null);
												setEditingValue(null);
											}}
											autoFocus
										/>
									) : (
										<span
											onClick={() => {
												setEditingValueId(goal.id);
												setEditingValue(goal.currentValue);
											}}
											className={styles.editableValue}
										>
											{goal.currentValue}
										</span>
									)}
								</div>
							</div>

							{/* Progress Bar */}
							<div className={styles.progressSection}>
								<Progress percent={progress} format={(percent) => `${percent?.toFixed(0)}%`} />
							</div>

							{/* Deadline */}
							<div className={styles.deadline}>
								<span>Hạn chót: {moment(goal.deadline).format('DD/MM/YYYY')}</span>
							</div>
						</Space>
					</Card>
				</Col>
			);
		})}
					</Row>
				) : (
					<Empty description="Chưa có mục tiêu nào" />
				)}
			</Card>

			{/* Drawer Form */}
			<Drawer
				title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
				onClose={() => setDrawerVisible(false)}
				open={drawerVisible}
				footer={
					<Space style={{ float: 'right' }}>
						<Button onClick={() => setDrawerVisible(false)}>Hủy</Button>
						<Button type="primary" onClick={handleDrawerOk}>
							Lưu
						</Button>
					</Space>
				}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="type" label="Loại mục tiêu" rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}>
						<Select options={GOAL_TYPES} />
					</Form.Item>
					<Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="currentValue" label="Giá trị hiện tại" rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="deadline" label="Hạn chót" rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
						<Select
							options={[
								{ label: 'Đang thực hiện', value: 'IN_PROGRESS' },
								{ label: 'Đã đạt', value: 'COMPLETED' },
								{ label: 'Đã hủy', value: 'CANCELLED' },
							]}
						/>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
}
