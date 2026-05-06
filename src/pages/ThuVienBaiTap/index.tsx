import {
	Button,
	Card,
	Col,
	Row,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Tag,
	Space,
	Popconfirm,
	message,
	Empty,
	Skeleton,
	Drawer,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { Exercise, MuscleGroup, DifficultyLevel } from '@/models/fitness';
import { getExercises, createExercise, updateExercise, deleteExercise } from '@/services/fitness';
import styles from './index.less';

type MuscleGroupOption = {
	label: string;
	value: MuscleGroup;
};

type DifficultyOption = {
	label: string;
	value: DifficultyLevel;
};

const MUSCLE_GROUPS: MuscleGroupOption[] = [
	{ label: 'Ngực', value: 'CHEST' },
	{ label: 'Lưng', value: 'BACK' },
	{ label: 'Chân', value: 'LEGS' },
	{ label: 'Vai', value: 'SHOULDERS' },
	{ label: 'Tay', value: 'ARMS' },
	{ label: 'Core', value: 'CORE' },
	{ label: 'Toàn thân', value: 'FULL_BODY' },
];

const DIFFICULTY_LEVELS: DifficultyOption[] = [
	{ label: 'Dễ', value: 'EASY' },
	{ label: 'Trung bình', value: 'MEDIUM' },
	{ label: 'Khó', value: 'HARD' },
];

interface ExerciseFormValues {
	name: string;
	muscleGroup: MuscleGroup;
	difficulty: DifficultyLevel;
	description: string;
	instructions: string;
	caloriesPerHour: number;
}

export default function ExerciseLibrary() {
	const [form] = Form.useForm();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
	const [searchText, setSearchText] = useState('');
	const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | null>(null);
	const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | null>(null);

	useEffect(() => {
		fetchExercises();
	}, [filterMuscleGroup, filterDifficulty]);

	const fetchExercises = async () => {
		setLoading(true);
		try {
			const data = await getExercises(filterMuscleGroup, filterDifficulty);
			setExercises(data);
		} catch (error) {
			message.error('Lỗi khi tải dữ liệu');
		} finally {
			setLoading(false);
		}
	};

	const handleAddExercise = () => {
		setEditingExercise(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEditExercise = (exercise: Exercise) => {
		setEditingExercise(exercise);
		form.setFieldsValue({
			name: exercise.name,
			muscleGroup: exercise.muscleGroup,
			difficulty: exercise.difficulty,
			description: exercise.description,
			instructions: exercise.instructions,
			caloriesPerHour: exercise.caloriesPerHour,
		});
		setModalVisible(true);
	};

	const handleDeleteExercise = async (id: string) => {
		try {
			await deleteExercise(id);
			message.success('Xóa bài tập thành công');
			fetchExercises();
		} catch (error) {
			message.error('Lỗi khi xóa bài tập');
		}
	};

	const handleModalOk = async () => {
		try {
			const values: ExerciseFormValues = await form.validateFields();
			const data = {
				name: values.name,
				muscleGroup: values.muscleGroup,
				difficulty: values.difficulty,
				description: values.description,
				instructions: values.instructions,
				caloriesPerHour: values.caloriesPerHour,
			};

			if (editingExercise) {
				await updateExercise(editingExercise.id, data);
				message.success('Cập nhật bài tập thành công');
			} else {
				await createExercise(data);
				message.success('Thêm bài tập thành công');
			}

			setModalVisible(false);
			fetchExercises();
		} catch (error: any) {
			message.error(error?.message || 'Lỗi khi lưu dữ liệu');
		}
	};

	const getDifficultyColor = (difficulty: DifficultyLevel): string => {
		const colorMap: Record<DifficultyLevel, string> = {
			EASY: 'green',
			MEDIUM: 'gold',
			HARD: 'red',
		};
		return colorMap[difficulty] || 'default';
	};

	const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
		return DIFFICULTY_LEVELS.find((d) => d.value === difficulty)?.label || difficulty;
	};

	const getMuscleGroupLabel = (muscleGroup: MuscleGroup): string => {
		return MUSCLE_GROUPS.find((m) => m.value === muscleGroup)?.label || muscleGroup;
	};

	const filteredExercises = exercises.filter((exercise) => {
		if (searchText && !exercise.name.toLowerCase().includes(searchText.toLowerCase())) {
			return false;
		}
		return true;
	});

	return (
		<div className={styles.exerciseLibrary}>
			<Card>
				{/* Filters */}
				<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
					<Col xs={24} sm={12} lg={6}>
						<Input.Search
							placeholder="Tìm kiếm bài tập..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Select
							placeholder="Chọn nhóm cơ"
							allowClear
							options={MUSCLE_GROUPS}
							value={filterMuscleGroup}
							onChange={(value) => setFilterMuscleGroup(value)}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Select
							placeholder="Chọn mức độ khó"
							allowClear
							options={DIFFICULTY_LEVELS}
							value={filterDifficulty}
							onChange={(value) => setFilterDifficulty(value)}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Space>
							<Button onClick={fetchExercises}>Tải lại</Button>
							<Button type="primary" icon={<PlusOutlined />} onClick={handleAddExercise}>
								Thêm bài tập
							</Button>
						</Space>
					</Col>
				</Row>

				{/* Exercise Grid */}
				{loading ? (
					<Skeleton active paragraph={{ rows: 6 }} />
				) : filteredExercises.length > 0 ? (
					<Row gutter={[16, 16]}>
						{filteredExercises.map((exercise) => (
							<Col xs={24} sm={12} lg={8} key={exercise.id}>
								<Card
									hoverable
									className={styles.exerciseCard}
									onClick={() => {
										setSelectedExercise(exercise);
										setDrawerVisible(true);
									}}
								>
									<Space direction="vertical" style={{ width: '100%' }} size="middle">
										{/* Header */}
										<div>
											<h3 style={{ marginBottom: '8px' }}>{exercise.name}</h3>
											<Tag color="blue">{getMuscleGroupLabel(exercise.muscleGroup)}</Tag>
											<Tag color={getDifficultyColor(exercise.difficulty)}>
												{getDifficultyLabel(exercise.difficulty)}
											</Tag>
										</div>

										{/* Description */}
										<p style={{ color: '#666', marginBottom: 0, minHeight: '40px', overflow: 'hidden' }}>
											{exercise.description}
										</p>

										{/* Calories */}
										<div style={{ fontSize: '14px', color: '#ff4d4f' }}>
											<strong>🔥 {exercise.caloriesPerHour} kcal/giờ</strong>
										</div>

										{/* Actions */}
										<div className={styles.actions}>
											<Button
												type="primary"
												size="small"
												icon={<EditOutlined />}
												onClick={(e) => {
													e.stopPropagation();
													handleEditExercise(exercise);
												}}
											>
												Sửa
											</Button>
											<Popconfirm
												title="Xóa bài tập"
												description="Bạn có chắc chắn muốn xóa?"
												onConfirm={(e) => {
													e?.stopPropagation();
													handleDeleteExercise(exercise.id);
												}}
												onClick={(e) => e.stopPropagation()}
											>
												<Button
													danger
													size="small"
													icon={<DeleteOutlined />}
													onClick={(e) => e.stopPropagation()}
												>
													Xóa
												</Button>
											</Popconfirm>
										</div>
									</Space>
								</Card>
							</Col>
						))}
					</Row>
				) : (
					<Empty description="Chưa có bài tập nào" />
				)}
			</Card>

			{/* Add/Edit Modal */}
			<Modal
				title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập mới'}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={() => setModalVisible(false)}
				width={700}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="muscleGroup"
						label="Nhóm cơ tác động"
						rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}
					>
						<Select options={MUSCLE_GROUPS} />
					</Form.Item>
					<Form.Item
						name="difficulty"
						label="Mức độ khó"
						rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
					>
						<Select options={DIFFICULTY_LEVELS} />
					</Form.Item>
					<Form.Item name="description" label="Mô tả ngắn" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item
						name="instructions"
						label="Hướng dẫn thực hiện"
						rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item
						name="caloriesPerHour"
						label="Calo đốt trung bình/giờ"
						rules={[{ required: true, message: 'Vui lòng nhập calo đốt' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Detail Drawer */}
			{selectedExercise && (
				<Drawer
					title={selectedExercise.name}
					onClose={() => setDrawerVisible(false)}
					open={drawerVisible}
					width={500}
					footer={
						<Space style={{ float: 'right' }}>
							<Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
							<Button type="primary" onClick={() => setDrawerVisible(false)}>
								Xong
							</Button>
						</Space>
					}
				>
					<Space direction="vertical" style={{ width: '100%' }} size="large">
						{/* Tags */}
						<div>
							<Tag color="blue">{getMuscleGroupLabel(selectedExercise.muscleGroup)}</Tag>
							<Tag color={getDifficultyColor(selectedExercise.difficulty)}>
								{getDifficultyLabel(selectedExercise.difficulty)}
							</Tag>
						</div>

						{/* Description */}
						<div>
							<h4>Mô tả</h4>
							<p>{selectedExercise.description}</p>
						</div>

						{/* Instructions */}
						<div>
							<h4>Hướng dẫn thực hiện</h4>
							<p style={{ whiteSpace: 'pre-wrap' }}>{selectedExercise.instructions}</p>
						</div>

						{/* Calories */}
						<div>
							<h4>Calo đốt trung bình</h4>
							<p style={{ fontSize: '16px', color: '#ff4d4f' }}>
								<strong>{selectedExercise.caloriesPerHour} kcal/giờ</strong>
							</p>
						</div>
					</Space>
				</Drawer>
			)}
		</div>
	);
}
