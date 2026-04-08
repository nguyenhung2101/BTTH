import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Progress, Rate, Row, Select, Slider, Space, Statistic, Table, Tabs, Tag, Typography, Upload, message } from 'antd';
import type { ApexOptions } from 'apexcharts';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';
import { useMemo, useState } from 'react';

import './style.less';

const { Title, Text, Paragraph } = Typography;

type DestinationType = 'Biển' | 'Núi' | 'Thành phố';

type BudgetCategory = {
	food: number;
	transport: number;
	stay: number;
	ticket: number;
};

type Destination = {
	id: number;
	name: string;
	type: DestinationType;
	location: string;
	rating: number;
	basePrice: number;
	visitHours: number;
	foodCost: number;
	stayCost: number;
	transportCost: number;
	description: string;
	image: string;
};

type DayPlan = {
	day: number;
	destinationIds: number[];
};

type SavedPlan = {
	id: number;
	createdAt: string;
	destinationIds: number[];
	budget: BudgetCategory;
	totalBudget: number;
};

const fmt = (val: number) => `${val.toLocaleString('vi-VN')} đ`;

const calcTravelBetween = (from: Destination, to: Destination) => {
	if (from.location === to.location) return 0.5;
	let hours = 0.9;
	if (from.type !== to.type) hours += 0.8;
	if (from.location !== to.location) hours += 1.2;
	return Number(hours.toFixed(1));
};

const getDefaultDestinations = (): Destination[] => [
	{
		id: 1,
		name: 'Bãi Sao',
		type: 'Biển',
		location: 'Phú Quốc',
		rating: 4.7,
		basePrice: 1800000,
		visitHours: 4,
		foodCost: 350000,
		stayCost: 700000,
		transportCost: 300000,
		description: 'Bãi biển nước trong, phù hợp nghỉ dưỡng và check-in.',
		image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
	},
	{
		id: 2,
		name: 'Fansipan',
		type: 'Núi',
		location: 'Sa Pa',
		rating: 4.8,
		basePrice: 2100000,
		visitHours: 6,
		foodCost: 420000,
		stayCost: 650000,
		transportCost: 520000,
		description: 'Nóc nhà Đông Dương, khí hậu mát và cảnh quan hùng vĩ.',
		image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
	},
	{
		id: 3,
		name: 'Phố cổ Hội An',
		type: 'Thành phố',
		location: 'Quảng Nam',
		rating: 4.9,
		basePrice: 1500000,
		visitHours: 5,
		foodCost: 380000,
		stayCost: 620000,
		transportCost: 280000,
		description: 'Không gian cổ kính, ẩm thực đặc sắc, đi bộ ngắm phố đèn lồng.',
		image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
	},
	{
		id: 4,
		name: 'Mũi Né',
		type: 'Biển',
		location: 'Bình Thuận',
		rating: 4.5,
		basePrice: 1300000,
		visitHours: 4,
		foodCost: 340000,
		stayCost: 560000,
		transportCost: 260000,
		description: 'Biển xanh, đồi cát đẹp, phù hợp du lịch ngắn ngày.',
		image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
	},
	{
		id: 5,
		name: 'Đà Lạt Center',
		type: 'Thành phố',
		location: 'Đà Lạt',
		rating: 4.6,
		basePrice: 1650000,
		visitHours: 5,
		foodCost: 360000,
		stayCost: 700000,
		transportCost: 300000,
		description: 'Khí hậu se lạnh, quán cafe đẹp, nhiều điểm ngắm cảnh.',
		image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
	},
	{
		id: 6,
		name: 'Thác Bản Giốc',
		type: 'Núi',
		location: 'Cao Bằng',
		rating: 4.7,
		basePrice: 1900000,
		visitHours: 6,
		foodCost: 390000,
		stayCost: 610000,
		transportCost: 480000,
		description: 'Phong cảnh thiên nhiên hùng vĩ, trải nghiệm gần biên giới.',
		image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
	},
];

const TravelPlannerPage: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>(getDefaultDestinations);
	const [typeFilter, setTypeFilter] = useState<'Tất cả' | DestinationType>('Tất cả');
	const [priceRange, setPriceRange] = useState<[number, number]>([1000000, 2500000]);
	const [ratingFilter, setRatingFilter] = useState<number>(0);
	const [sortBy, setSortBy] = useState<'ratingDesc' | 'priceAsc' | 'priceDesc'>('ratingDesc');
	const [dayPlans, setDayPlans] = useState<DayPlan[]>([
		{ day: 1, destinationIds: [] },
		{ day: 2, destinationIds: [] },
		{ day: 3, destinationIds: [] },
	]);
	const [selectedDay, setSelectedDay] = useState<number>(1);
	const [budgetLimit, setBudgetLimit] = useState<number>(6500000);
	const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
	const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
	const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [form] = Form.useForm<Destination>();

	const maxPrice = useMemo(() => {
		const values = destinations.map((item) => item.basePrice);
		return Math.max(...values, 2500000);
	}, [destinations]);

	const destinationMap = useMemo(
		() =>
			destinations.reduce<Record<number, Destination>>((acc, item) => {
				acc[item.id] = item;
				return acc;
			}, {}),
		[destinations],
	);

	const filteredDestinations = useMemo(() => {
		const list = destinations
			.filter((item) => (typeFilter === 'Tất cả' ? true : item.type === typeFilter))
			.filter((item) => item.basePrice >= priceRange[0] && item.basePrice <= priceRange[1])
			.filter((item) => item.rating >= ratingFilter);

		if (sortBy === 'priceAsc') {
			return [...list].sort((a, b) => a.basePrice - b.basePrice);
		}
		if (sortBy === 'priceDesc') {
			return [...list].sort((a, b) => b.basePrice - a.basePrice);
		}
		return [...list].sort((a, b) => b.rating - a.rating);
	}, [destinations, priceRange, ratingFilter, sortBy, typeFilter]);

	const itinerarySummary = useMemo(() => {
		const budget: BudgetCategory = { food: 0, stay: 0, transport: 0, ticket: 0 };
		let travelHours = 0;
		let visitHours = 0;
		const allIds: number[] = [];

		dayPlans.forEach((dayPlan) => {
			const dayDestinations = dayPlan.destinationIds
				.map((id) => destinationMap[id])
				.filter((item): item is Destination => Boolean(item));

			dayDestinations.forEach((item, index) => {
				budget.food += item.foodCost;
				budget.stay += item.stayCost;
				budget.transport += item.transportCost;
				budget.ticket += item.basePrice;
				visitHours += item.visitHours;
				allIds.push(item.id);

				if (index > 0) {
					travelHours += calcTravelBetween(dayDestinations[index - 1], item);
				}
			});
		});

		const totalBudget = budget.food + budget.stay + budget.transport + budget.ticket;
		return {
			budget,
			totalBudget,
			travelHours: Number(travelHours.toFixed(1)),
			visitHours,
			allIds,
		};
	}, [dayPlans, destinationMap]);

	const overBudget = itinerarySummary.totalBudget > budgetLimit;

	const monthlyStats = useMemo(() => {
		const labels = Array.from({ length: 6 }).map((_, index) => moment().subtract(5 - index, 'months').format('MM/YYYY'));
		const countMap = labels.reduce<Record<string, number>>((acc, key) => {
			acc[key] = 0;
			return acc;
		}, {});
		const revenueMap = labels.reduce<Record<string, number>>((acc, key) => {
			acc[key] = 0;
			return acc;
		}, {});

		savedPlans.forEach((plan) => {
			const key = moment(plan.createdAt).format('MM/YYYY');
			if (countMap[key] !== undefined) {
				countMap[key] += 1;
				revenueMap[key] += plan.totalBudget * 0.08;
			}
		});

		return {
			labels,
			counts: labels.map((label) => countMap[label]),
			revenues: labels.map((label) => Number(revenueMap[label].toFixed(0))),
		};
	}, [savedPlans]);

	const destinationPopularity = useMemo(() => {
		const counter = savedPlans.reduce<Record<number, number>>((acc, plan) => {
			plan.destinationIds.forEach((id) => {
				acc[id] = (acc[id] || 0) + 1;
			});
			return acc;
		}, {});

		return destinations
			.map((item) => ({
				name: item.name,
				count: counter[item.id] || 0,
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);
	}, [destinations, savedPlans]);

	const addDestinationToDay = (destinationId: number) => {
		setDayPlans((prev) =>
			prev.map((plan) => {
				if (plan.day !== selectedDay) return plan;
				if (plan.destinationIds.includes(destinationId)) return plan;
				return {
					...plan,
					destinationIds: [...plan.destinationIds, destinationId],
				};
			}),
		);
	};

	const removeDestinationFromDay = (day: number, destinationId: number) => {
		setDayPlans((prev) =>
			prev.map((plan) =>
				plan.day === day
					? { ...plan, destinationIds: plan.destinationIds.filter((id) => id !== destinationId) }
					: plan,
			),
		);
	};

	const moveDestination = (day: number, index: number, direction: -1 | 1) => {
		setDayPlans((prev) =>
			prev.map((plan) => {
				if (plan.day !== day) return plan;
				const nextIndex = index + direction;
				if (nextIndex < 0 || nextIndex >= plan.destinationIds.length) return plan;
				const ids = [...plan.destinationIds];
				const [picked] = ids.splice(index, 1);
				ids.splice(nextIndex, 0, picked);
				return { ...plan, destinationIds: ids };
			}),
		);
	};

	const addNewDay = () => {
		setDayPlans((prev) => [...prev, { day: prev.length + 1, destinationIds: [] }]);
	};

	const saveCurrentPlan = () => {
		if (itinerarySummary.allIds.length === 0) {
			message.warning('Bạn chưa chọn điểm đến nào cho lịch trình.');
			return;
		}

		const newPlan: SavedPlan = {
			id: Date.now(),
			createdAt: moment().toISOString(),
			destinationIds: itinerarySummary.allIds,
			budget: itinerarySummary.budget,
			totalBudget: itinerarySummary.totalBudget,
		};

		setSavedPlans((prev) => [newPlan, ...prev]);
		message.success('Đã lưu lịch trình thành công!');
	};

	const readAsDataUrl = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});

	const openCreateModal = () => {
		setEditingDestination(null);
		form.resetFields();
		setAdminModalOpen(true);
	};

	const openEditModal = (record: Destination) => {
		setEditingDestination(record);
		form.setFieldsValue(record);
		setAdminModalOpen(true);
	};

	const removeDestination = (id: number) => {
		setDestinations((prev) => prev.filter((item) => item.id !== id));
		setDayPlans((prev) =>
			prev.map((plan) => ({
				...plan,
				destinationIds: plan.destinationIds.filter((itemId) => itemId !== id),
			})),
		);
		message.success('Đã xóa điểm đến.');
	};

	const submitDestination = async () => {
		const values = await form.validateFields();
		if (editingDestination) {
			setDestinations((prev) => prev.map((item) => (item.id === editingDestination.id ? { ...item, ...values } : item)));
			message.success('Đã cập nhật điểm đến.');
		} else {
			const maxId = destinations.reduce((acc, item) => Math.max(acc, item.id), 0);
			setDestinations((prev) => [{ ...values, id: maxId + 1 }, ...prev]);
			message.success('Đã thêm điểm đến mới.');
		}

		setAdminModalOpen(false);
	};

	const budgetSeries = [
		itinerarySummary.budget.food,
		itinerarySummary.budget.transport,
		itinerarySummary.budget.stay,
		itinerarySummary.budget.ticket,
	];

	const donutOptions: ApexOptions = {
		labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Vé/Tham quan'],
		legend: { position: 'bottom' },
		tooltip: {
			y: {
				formatter: (val: number) => fmt(val),
			},
		},
		dataLabels: {
			enabled: true,
		},
	};

	const adminColumnOptions: ApexOptions = {
		chart: { type: 'bar', toolbar: { show: false } },
		xaxis: { categories: monthlyStats.labels },
		yaxis: [
			{
				title: { text: 'Số lịch trình' },
			},
			{
				opposite: true,
				title: { text: 'Doanh thu ước tính (đ)' },
				labels: { formatter: (val: number) => `${Math.round(val / 1000)}K` },
			},
		],
		legend: { position: 'top' },
		tooltip: {
			y: [
				{ formatter: (val: number) => `${val} lịch trình` },
				{ formatter: (val: number) => fmt(val) },
			],
		},
	};

	const adminSeries = [
		{ name: 'Số lịch trình', type: 'column', data: monthlyStats.counts },
		{ name: 'Doanh thu ước tính', type: 'line', data: monthlyStats.revenues },
	];

	const adminTableColumns = [
		{
			title: 'Điểm đến',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			render: (val: DestinationType) => <Tag color={val === 'Biển' ? 'blue' : val === 'Núi' ? 'green' : 'gold'}>{val}</Tag>,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (val: number) => <Rate disabled value={val} allowHalf style={{ fontSize: 14 }} />,
		},
		{
			title: 'Giá cơ bản',
			dataIndex: 'basePrice',
			key: 'basePrice',
			render: (val: number) => fmt(val),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: unknown, record: Destination) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa điểm đến này?' onConfirm={() => removeDestination(record.id)}>
						<Button danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='travel-planner-page'>
			<Card className='travel-header-card'>
				<Title level={2} style={{ marginBottom: 4 }}>
					Ứng dụng lập kế hoạch du lịch
				</Title>
				<Text type='secondary'>
					Khám phá điểm đến, tạo lịch trình, theo dõi ngân sách và quản trị dữ liệu trong một màn hình.
				</Text>
			</Card>

			<Tabs defaultActiveKey='explore'>
				<Tabs.TabPane tab='1. Trang chủ - Khám phá điểm đến' key='explore'>
					<>
								<Card className='travel-card' title='Filter / Sort điểm đến'>
									<Row gutter={[16, 16]}>
										<Col xs={24} md={12} lg={6}>
											<Text strong>Loại hình</Text>
											<Select
												style={{ width: '100%', marginTop: 8 }}
												value={typeFilter}
												onChange={(val: 'Tất cả' | DestinationType) => setTypeFilter(val)}
												options={[
													{ value: 'Tất cả', label: 'Tất cả' },
													{ value: 'Biển', label: 'Biển' },
													{ value: 'Núi', label: 'Núi' },
													{ value: 'Thành phố', label: 'Thành phố' },
												]}
											/>
										</Col>
										<Col xs={24} md={12} lg={8}>
											<Text strong>Khoảng giá</Text>
											<Slider
												range
												min={1000000}
												max={Math.max(maxPrice, 2500000)}
												step={50000}
												value={priceRange}
												onChange={(val) => setPriceRange(val as [number, number])}
											/>
											<Text type='secondary'>
												{fmt(priceRange[0])} - {fmt(priceRange[1])}
											</Text>
										</Col>
										<Col xs={24} md={12} lg={4}>
											<Text strong>Đánh giá tối thiểu</Text>
											<Rate
												allowClear
												allowHalf
												value={ratingFilter}
												onChange={setRatingFilter}
												style={{ display: 'block', marginTop: 8 }}
											/>
										</Col>
										<Col xs={24} md={12} lg={6}>
											<Text strong>Sắp xếp</Text>
											<Select
												style={{ width: '100%', marginTop: 8 }}
												value={sortBy}
												onChange={(val: 'ratingDesc' | 'priceAsc' | 'priceDesc') => setSortBy(val)}
												options={[
													{ value: 'ratingDesc', label: 'Đánh giá cao nhất' },
													{ value: 'priceAsc', label: 'Giá thấp đến cao' },
													{ value: 'priceDesc', label: 'Giá cao đến thấp' },
												]}
											/>
										</Col>
									</Row>
								</Card>

								<Row gutter={[16, 16]}>
									{filteredDestinations.map((item) => (
										<Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
											<Card
												hoverable
												className='travel-card'
												cover={<img alt={item.name} src={item.image} className='travel-cover-image' />}
												actions={[
													<Button key='add' type='link' onClick={() => addDestinationToDay(item.id)}>
														Thêm vào ngày {selectedDay}
													</Button>,
												]}
											>
												<Tag color={item.type === 'Biển' ? 'blue' : item.type === 'Núi' ? 'green' : 'gold'}>{item.type}</Tag>
												<Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
													{item.name}
												</Title>
												<Text type='secondary'>{item.location}</Text>
												<div style={{ marginTop: 8 }}>
													<Rate disabled allowHalf value={item.rating} style={{ fontSize: 14 }} />
												</div>
												<Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8, minHeight: 40 }}>
													{item.description}
												</Paragraph>
												<Text strong>{fmt(item.basePrice)}</Text>
											</Card>
										</Col>
									))}
								</Row>
					</>
				</Tabs.TabPane>
				<Tabs.TabPane tab='2. Tạo lịch trình du lịch' key='itinerary'>
					<Row gutter={[16, 16]}>
								<Col xs={24} lg={15}>
									<Card className='travel-card' title='Lập lịch theo ngày'>
										<Space wrap style={{ marginBottom: 16 }}>
											<Text strong>Chọn ngày thao tác:</Text>
											<Select
												value={selectedDay}
												onChange={(val: number) => setSelectedDay(val)}
												options={dayPlans.map((item) => ({ value: item.day, label: `Ngày ${item.day}` }))}
												style={{ width: 140 }}
											/>
											<Button icon={<PlusOutlined />} onClick={addNewDay}>
												Thêm ngày
											</Button>
										</Space>

										<Row gutter={[12, 12]}>
											{dayPlans.map((dayPlan) => {
												const dayDestinations = dayPlan.destinationIds
													.map((id) => destinationMap[id])
													.filter((item): item is Destination => Boolean(item));
												return (
													<Col xs={24} md={12} key={dayPlan.day}>
														<Card size='small' title={`Ngày ${dayPlan.day}`} className='day-plan-card'>
															{dayDestinations.length === 0 ? (
																<Text type='secondary'>Chưa có điểm đến.</Text>
															) : (
																<Space direction='vertical' style={{ width: '100%' }}>
																	{dayDestinations.map((item, index) => (
																		<Card size='small' key={`${dayPlan.day}-${item.id}`}>
																			<div className='itinerary-row'>
																				<div>
																					<Text strong>{item.name}</Text>
																					<br />
																					<Text type='secondary'>
																						{item.location} | {item.visitHours} giờ tham quan
																					</Text>
																				</div>
																				<Space>
																					<Button size='small' onClick={() => moveDestination(dayPlan.day, index, -1)} disabled={index === 0}>
																						↑
																					</Button>
																					<Button
																						size='small'
																						onClick={() => moveDestination(dayPlan.day, index, 1)}
																						disabled={index === dayDestinations.length - 1}
																					>
																						↓
																					</Button>
																					<Button danger size='small' onClick={() => removeDestinationFromDay(dayPlan.day, item.id)}>
																						Xóa
																					</Button>
																				</Space>
																			</div>
																		</Card>
																	))}
																</Space>
															)}
														</Card>
													</Col>
												);
											})}
										</Row>
									</Card>
								</Col>

								<Col xs={24} lg={9}>
									<Card className='travel-card' title='Tổng quan lịch trình'>
										<Statistic title='Ngân sách tạm tính' value={itinerarySummary.totalBudget} formatter={(val) => fmt(Number(val))} />
										<Statistic
											title='Tổng thời gian tham quan'
											value={itinerarySummary.visitHours}
											suffix='giờ'
											style={{ marginTop: 12 }}
										/>
										<Statistic
											title='Thời gian di chuyển ước tính'
											value={itinerarySummary.travelHours}
											suffix='giờ'
											style={{ marginTop: 12 }}
										/>
										<Button type='primary' block style={{ marginTop: 16 }} onClick={saveCurrentPlan}>
											Lưu lịch trình hiện tại
										</Button>
									</Card>
								</Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='3. Quản lý ngân sách' key='budget'>
					<Row gutter={[16, 16]}>
								<Col xs={24} lg={15}>
									<Card className='travel-card' title='Biểu đồ phân bổ ngân sách'>
										<ReactApexChart options={donutOptions} series={budgetSeries} type='donut' height={330} />
									</Card>
								</Col>
								<Col xs={24} lg={9}>
									<Card className='travel-card' title='Theo dõi hạn mức'>
										<Text strong>Ngân sách mục tiêu</Text>
										<InputNumber
											style={{ width: '100%', marginTop: 8 }}
											min={1000000}
											step={100000}
											value={budgetLimit}
											onChange={(val) => setBudgetLimit(Number(val || 0))}
										/>
										<Paragraph style={{ marginTop: 8, marginBottom: 16 }}>{fmt(budgetLimit)}</Paragraph>

										<Progress
											percent={Math.min(100, Number(((itinerarySummary.totalBudget / Math.max(budgetLimit, 1)) * 100).toFixed(1)))}
											status={overBudget ? 'exception' : 'active'}
										/>
										{overBudget ? (
											<Card size='small' style={{ borderColor: '#ff4d4f', background: '#fff1f0' }}>
												<Text strong style={{ color: '#cf1322' }}>
													Cảnh báo vượt ngân sách {fmt(itinerarySummary.totalBudget - budgetLimit)}
												</Text>
											</Card>
										) : (
											<Card size='small' style={{ borderColor: '#b7eb8f', background: '#f6ffed' }}>
												<Text strong style={{ color: '#389e0d' }}>
													Ngân sách đang trong mức an toàn
												</Text>
											</Card>
										)}

										<Space direction='vertical' style={{ width: '100%', marginTop: 16 }}>
											<Text>Ăn uống: {fmt(itinerarySummary.budget.food)}</Text>
											<Text>Di chuyển: {fmt(itinerarySummary.budget.transport)}</Text>
											<Text>Lưu trú: {fmt(itinerarySummary.budget.stay)}</Text>
											<Text>Vé/Tham quan: {fmt(itinerarySummary.budget.ticket)}</Text>
										</Space>
									</Card>
								</Col>
					</Row>
				</Tabs.TabPane>
				<Tabs.TabPane tab='4. Trang quản trị (Admin)' key='admin'>
					<>
								<Row gutter={[16, 16]}>
									<Col xs={24}>
										<Card
											className='travel-card'
											title='Quản lý điểm đến'
											extra={
												<Button type='primary' icon={<PlusOutlined />} onClick={openCreateModal}>
													Thêm điểm đến
												</Button>
											}
										>
											<Table
												columns={adminTableColumns}
												dataSource={destinations}
												rowKey='id'
												scroll={{ x: 920 }}
												pagination={{ pageSize: 6 }}
											/>
										</Card>
									</Col>
								</Row>

								<Row gutter={[16, 16]}>
									<Col xs={24} lg={16}>
										<Card className='travel-card' title='Thống kê theo tháng'>
											<ReactApexChart options={adminColumnOptions} series={adminSeries as any} type='line' height={320} />
										</Card>
									</Col>
									<Col xs={24} lg={8}>
										<Card className='travel-card' title='Địa điểm phổ biến'>
											<Space direction='vertical' style={{ width: '100%' }}>
												{destinationPopularity.map((item) => (
													<Card key={item.name} size='small'>
														<div className='popular-row'>
															<Text>{item.name}</Text>
															<Tag color='processing'>{item.count} lượt</Tag>
														</div>
													</Card>
												))}
											</Space>
										</Card>
									</Col>
								</Row>
					</>
				</Tabs.TabPane>
			</Tabs>

			<Modal
				visible={adminModalOpen}
				title={editingDestination ? 'Cập nhật điểm đến' : 'Thêm điểm đến'}
				onCancel={() => setAdminModalOpen(false)}
				onOk={submitDestination}
				okText={editingDestination ? 'Lưu thay đổi' : 'Tạo mới'}
				destroyOnClose
				width={680}
			>
				<Form layout='vertical' form={form} preserve={false}>
					<Row gutter={[12, 12]}>
						<Col xs={24} md={12}>
							<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='location' label='Địa điểm' rules={[{ required: true, message: 'Nhập địa điểm' }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='type' label='Loại hình' rules={[{ required: true, message: 'Chọn loại hình' }]}>
								<Select
									options={[
										{ value: 'Biển', label: 'Biển' },
										{ value: 'Núi', label: 'Núi' },
										{ value: 'Thành phố', label: 'Thành phố' },
									]}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='rating' label='Rating' rules={[{ required: true, message: 'Nhập rating' }]}>
								<InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='basePrice' label='Chi phí cơ bản' rules={[{ required: true, message: 'Nhập chi phí cơ bản' }]}>
								<InputNumber min={100000} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='visitHours' label='Thời gian tham quan (giờ)' rules={[{ required: true, message: 'Nhập thời gian tham quan' }]}>
								<InputNumber min={1} max={24} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='foodCost' label='Chi ăn uống' rules={[{ required: true, message: 'Nhập chi ăn uống' }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='stayCost' label='Chi lưu trú' rules={[{ required: true, message: 'Nhập chi lưu trú' }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='transportCost' label='Chi di chuyển' rules={[{ required: true, message: 'Nhập chi di chuyển' }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Nhập mô tả' }]}>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name='image' label='Ảnh điểm đến' rules={[{ required: true, message: 'Thêm ảnh điểm đến' }]}>
								<Input placeholder='Nhập URL ảnh hoặc dùng nút upload phía dưới' />
							</Form.Item>
							<Upload
								showUploadList={false}
								beforeUpload={() => false}
								onChange={async (info) => {
									const fileObj = info.file.originFileObj;
									if (!fileObj) return;
									setUploading(true);
									try {
										const dataUrl = await readAsDataUrl(fileObj as File);
										form.setFieldsValue({ image: dataUrl } as Destination);
										message.success('Đã tải ảnh vào form.');
									} finally {
										setUploading(false);
									}
								}}
							>
								<Button icon={<UploadOutlined />} loading={uploading}>
									Upload ảnh từ máy
								</Button>
							</Upload>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default TravelPlannerPage;
