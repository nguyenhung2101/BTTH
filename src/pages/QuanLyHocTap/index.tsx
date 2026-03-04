import {
	Button,
	Table,
	Card,
	Row,
	Col,
	Popconfirm,
	message,
	Tabs,
	Empty,
	Progress,
	Statistic,
	Form,
	InputNumber,
	Modal,
	Select,
	Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import SubjectForm from './SubjectForm';
import StudySessionForm from './StudySessionForm';
import { QuanLyHocTap } from '@/models/quanlyhocsap';

const QuanLyHocTapPage: React.FC = () => {
	const [subjects, setSubjects] = useState<QuanLyHocTap.Subject[]>([]);
	const [sessions, setSessions] = useState<QuanLyHocTap.StudySession[]>([]);
	const [goals, setGoals] = useState<QuanLyHocTap.MonthlyGoal[]>([]);

	// Subject modal
	const [subjectModalVisible, setSubjectModalVisible] = useState(false);
	const [editingSubject, setEditingSubject] = useState<QuanLyHocTap.Subject | null>(null);

	// Session modal
	const [sessionModalVisible, setSessionModalVisible] = useState(false);
	const [editingSession, setEditingSession] = useState<QuanLyHocTap.StudySession | null>(null);

	// Goal modal
	const [goalModalVisible, setGoalModalVisible] = useState(false);
	const [goalForm] = Form.useForm();

	// Load dữ liệu từ localStorage
	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		const savedSubjects = localStorage.getItem('hocsap_subjects');
		const savedSessions = localStorage.getItem('hocsap_sessions');
		const savedGoals = localStorage.getItem('hocsap_goals');

		setSubjects(savedSubjects ? JSON.parse(savedSubjects) : getDefaultSubjects());
		setSessions(savedSessions ? JSON.parse(savedSessions) : []);
		setGoals(savedGoals ? JSON.parse(savedGoals) : []);
	};

	const getDefaultSubjects = (): QuanLyHocTap.Subject[] => {
		const defaultSubjects = [
			{ id: uuidv4(), name: 'Toán', color: '#FF6B6B', createdAt: Date.now() },
			{ id: uuidv4(), name: 'Văn', color: '#4ECDC4', createdAt: Date.now() },
			{ id: uuidv4(), name: 'Anh', color: '#45B7D1', createdAt: Date.now() },
			{ id: uuidv4(), name: 'Khoa học', color: '#FFA07A', createdAt: Date.now() },
		];
		localStorage.setItem('hocsap_subjects', JSON.stringify(defaultSubjects));
		return defaultSubjects;
	};

	const saveData = (newSubjects?: QuanLyHocTap.Subject[], newSessions?: QuanLyHocTap.StudySession[], newGoals?: QuanLyHocTap.MonthlyGoal[]) => {
		if (newSubjects) {
			setSubjects(newSubjects);
			localStorage.setItem('hocsap_subjects', JSON.stringify(newSubjects));
		}
		if (newSessions) {
			setSessions(newSessions);
			localStorage.setItem('hocsap_sessions', JSON.stringify(newSessions));
		}
		if (newGoals) {
			setGoals(newGoals);
			localStorage.setItem('hocsap_goals', JSON.stringify(newGoals));
		}
	};

	// ============ Subject Management ============
	const handleAddSubject = () => {
		setEditingSubject(null);
		setSubjectModalVisible(true);
	};

	const handleEditSubject = (subject: QuanLyHocTap.Subject) => {
		setEditingSubject(subject);
		setSubjectModalVisible(true);
	};

	const handleDeleteSubject = (id: string) => {
		const newSubjects = subjects.filter((s) => s.id !== id);
		const newSessions = sessions.filter((s) => s.subjectId !== id);
		saveData(newSubjects, newSessions);
		message.success('Xóa môn học thành công');
	};

	const handleSubjectSubmit = (data: any) => {
		if (editingSubject) {
			const newSubjects = subjects.map((s) => (s.id === editingSubject.id ? data : s));
			saveData(newSubjects);
			message.success('Cập nhật môn học thành công');
		} else {
			saveData([...subjects, data]);
			message.success('Thêm môn học thành công');
		}
		setSubjectModalVisible(false);
		setEditingSubject(null);
	};

	// ============ Study Session Management ============
	const handleAddSession = () => {
		setEditingSession(null);
		setSessionModalVisible(true);
	};

	const handleEditSession = (session: QuanLyHocTap.StudySession) => {
		setEditingSession(session);
		setSessionModalVisible(true);
	};

	const handleDeleteSession = (id: string) => {
		const newSessions = sessions.filter((s) => s.id !== id);
		saveData(undefined, newSessions);
		message.success('Xóa lịch học thành công');
	};

	const handleSessionSubmit = (data: any) => {
		if (editingSession) {
			const newSessions = sessions.map((s) => (s.id === editingSession.id ? data : s));
			saveData(undefined, newSessions);
			message.success('Cập nhật lịch học thành công');
		} else {
			saveData(undefined, [...sessions, data]);
			message.success('Thêm lịch học thành công');
		}
		setSessionModalVisible(false);
		setEditingSession(null);
	};

	// ============ Goal Management ============
	const getCurrentMonthGoal = (): QuanLyHocTap.MonthlyGoal | null => {
		const currentMonth = dayjs().format('YYYY-MM');
		return goals.find((g) => g.month === currentMonth) || null;
	};

	const handleSetGoal = async () => {
		try {
			const values = await goalForm.validateFields();
			const currentMonth = dayjs().format('YYYY-MM');
			const existingGoal = goals.find((g) => g.month === currentMonth);

			let newGoals: QuanLyHocTap.MonthlyGoal[];
			if (existingGoal) {
				newGoals = goals.map((g) =>
					g.month === currentMonth
						? {
								...g,
								goals: values.goals,
						  }
						: g
				);
			} else {
				newGoals = [
					...goals,
					{
						id: uuidv4(),
						month: currentMonth,
						goals: values.goals,
						createdAt: Date.now(),
					},
				];
			}

			saveData(undefined, undefined, newGoals);
			message.success('Cập nhật mục tiêu thành công');
			setGoalModalVisible(false);
			goalForm.resetFields();
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin');
		}
	};

	// ============ Calculations ============
	const calculateProgress = (subjectId: string) => {
		const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');
		const monthEnd = dayjs().endOf('month').format('YYYY-MM-DD');

		const monthSessions = sessions.filter(
			(s) => s.subjectId === subjectId && s.date >= monthStart && s.date <= monthEnd
		);

		const totalMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);
		const totalHours = totalMinutes / 60;

		return { totalHours, totalMinutes, sessions: monthSessions };
	};

	const getTotalMonthProgress = () => {
		const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');
		const monthEnd = dayjs().endOf('month').format('YYYY-MM-DD');

		const monthSessions = sessions.filter((s) => s.date >= monthStart && s.date <= monthEnd);
		const totalMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);
		return totalMinutes / 60;
	};

	// ============ Columns ============
	const subjectColumns = [
		{
			title: 'Tên môn học',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: QuanLyHocTap.Subject) => (
				<Space>
					<div
						style={{
							width: '16px',
							height: '16px',
							backgroundColor: record.color,
							borderRadius: '4px',
						}}
					/>
					<span>{text}</span>
				</Space>
			),
		},
		{
			title: 'Tiến độ tháng này',
			dataIndex: 'id',
			key: 'progress',
			render: (id: string) => {
				const { totalHours } = calculateProgress(id);
				return <span>{totalHours.toFixed(1)} giờ</span>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyHocTap.Subject) => (
				<Space>
					<Button
						type="primary"
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEditSubject(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title="Xác nhận xóa?"
						onConfirm={() => handleDeleteSubject(record.id)}
					>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const sessionColumns = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
			width: 120,
			render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
			sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		},
		{
			title: 'Giờ',
			dataIndex: 'startTime',
			key: 'startTime',
			width: 80,
		},
		{
			title: 'Thời lượng',
			dataIndex: 'duration',
			key: 'duration',
			width: 100,
			render: (duration: number) => `${duration} phút`,
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
			ellipsis: true,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'notes',
			key: 'notes',
			ellipsis: true,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_: any, record: QuanLyHocTap.StudySession) => (
				<Space>
					<Button
						type="primary"
						size="small"
						icon={<EditOutlined />}
						onClick={() => handleEditSession(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title="Xác nhận xóa?"
						onConfirm={() => handleDeleteSession(record.id)}
					>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const currentMonthGoal = getCurrentMonthGoal();

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h1> Quản lý tiến độ học tập</h1>
			</div>

<Tabs>
			<Tabs.TabPane tab=" Danh mục môn học" key="1">
				<div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAddSubject}
						style={{ marginBottom: '16px' }}
					>
						Thêm môn học
					</Button>
					<Table
						dataSource={subjects}
						columns={subjectColumns}
						rowKey="id"
						pagination={false}
					/>
				</div>
			</Tabs.TabPane>

			<Tabs.TabPane tab=" Lịch học" key="2">
				<div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAddSession}
						style={{ marginBottom: '16px' }}
						disabled={subjects.length === 0}
					>
						Thêm lịch học
					</Button>
					{sessions.length === 0 ? (
						<Empty description="Chưa có lịch học nào" />
					) : (
						<Table
							dataSource={sessions.sort(
								(a, b) =>
									new Date(b.date + ' ' + b.startTime).getTime() -
									new Date(a.date + ' ' + a.startTime).getTime()
							)}
							columns={sessionColumns}
							rowKey="id"
							pagination={{ pageSize: 10 }}
							expandable={{
								expandedRowRender: (record) => (
									<div>
										<p>
											<strong>Môn học:</strong>{' '}
											{subjects.find((s) => s.id === record.subjectId)?.name}
										</p>
										<p>
											<strong>Nội dung:</strong> {record.content}
										</p>
										{record.notes && (
											<p>
												<strong>Ghi chú:</strong> {record.notes}
											</p>
										)}
									</div>
								),
							}}
						/>
					)}
				</div>
			</Tabs.TabPane>

			<Tabs.TabPane tab=" Mục tiêu tháng" key="3">
				<div>
					<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
						<Col xs={24} md={8}>
							<Card>
								<Statistic
									title="Tổng giờ học tháng này"
									value={getTotalMonthProgress()}
									precision={1}
									suffix="giờ"
								/>
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Statistic
									title="Số buổi học"
									value={sessions.filter(
										(s) =>
											s.date >= dayjs().startOf('month').format('YYYY-MM-DD') &&
											s.date <= dayjs().endOf('month').format('YYYY-MM-DD')
									).length}
								/>
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Button
									type="primary"
									onClick={() => {
										if (currentMonthGoal) {
											goalForm.setFieldsValue({ goals: currentMonthGoal.goals });
										} else {
											goalForm.setFieldsValue({
												goals: [{ targetHours: 0 }],
											});
										}
										setGoalModalVisible(true);
									}}
									style={{ width: '100%' }}
								>
									<CalendarOutlined /> Đặt mục tiêu
								</Button>
							</Card>
						</Col>
					</Row>

					{subjects.length > 0 && (
						<Card title="Tiến độ từng môn">
							<Row gutter={[16, 16]}>
								{subjects.map((subject) => {
									const { totalHours } = calculateProgress(subject.id);
									const goalForSubject = currentMonthGoal?.goals.find(
										(g) => g.subjectId === subject.id
									)?.targetHours || 0;

									const percentage =
										goalForSubject > 0
											? Math.min((totalHours / goalForSubject) * 100, 100)
											: 0;

												return (
													<Col xs={24} md={12} lg={8} key={subject.id}>
														<Card
															style={{
																borderLeft: `4px solid ${subject.color}`,
															}}
														>
															<p style={{ marginBottom: '12px', fontWeight: 'bold' }}>
																{subject.name}
															</p>
															<p style={{ marginBottom: '8px', fontSize: '12px' }}>
																{totalHours.toFixed(1)} / {goalForSubject} giờ
															</p>
															<Progress
																percent={percentage}
																strokeColor={subject.color}
																status={
																	goalForSubject === 0
																		? 'normal'
																		: totalHours >= goalForSubject
																		? 'success'
																		: 'active'
																}
															/>
														</Card>
													</Col>
												);
											})}
										</Row>
									</Card>
								)}
							</div>
						</Tabs.TabPane>
				</Tabs>

			<SubjectForm
				visible={subjectModalVisible}
				isEdit={!!editingSubject}
				initialData={editingSubject}
				onCancel={() => {
					setSubjectModalVisible(false);
					setEditingSubject(null);
				}}
				onSubmit={handleSubjectSubmit}
			/>

			<StudySessionForm
				visible={sessionModalVisible}
				isEdit={!!editingSession}
				initialData={editingSession}
				subjects={subjects}
				onCancel={() => {
					setSessionModalVisible(false);
					setEditingSession(null);
				}}
				onSubmit={handleSessionSubmit}
			/>

			<Modal
				title="Đặt mục tiêu tháng"
				visible={goalModalVisible}
				onOk={handleSetGoal}
				onCancel={() => {
					setGoalModalVisible(false);
					goalForm.resetFields();
				}}
				width={600}
			>
				<Form form={goalForm} layout="vertical">
					<Form.List name="goals">
						{(fields, { add, remove }) => (
							<div>
								{fields.map((field, index) => (
									<div key={field.key} style={{ marginBottom: '16px' }}>
										<Space>
											<Form.Item
												{...field}
												label="Môn học (tuỳ chọn)"
												name={[field.name, 'subjectId']}
												style={{ marginBottom: 0 }}
											>
												<Select
													placeholder="Chọn môn học hoặc để trống cho tổng thể"
													style={{ width: '200px' }}
												>
													{subjects.map((s) => (
														<Select.Option key={s.id} value={s.id}>
															{s.name}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item
												{...field}
												label="Mục tiêu (giờ)"
												name={[field.name, 'targetHours']}
												rules={[
													{
														required: true,
														message: 'Vui lòng nhập số giờ',
													},
												]}
												style={{ marginBottom: 0 }}
											>
												<InputNumber min={0} max={500} style={{ width: '100px' }} />
											</Form.Item>
											<Button
												danger
												onClick={() => remove(field.name)}
												style={{ marginTop: '32px' }}
											>
												Xóa
											</Button>
										</Space>
									</div>
								))}
								<Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
									+ Thêm mục tiêu khác
								</Button>
							</div>
						)}
					</Form.List>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyHocTapPage;
