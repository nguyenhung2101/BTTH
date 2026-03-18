import { EditOutlined, PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Rate,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tabs,
	Tag,
	TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { bookingService } from './service';
import {
	Appointment,
	AppointmentFormValues,
	AppointmentStatus,
	Employee,
	EmployeeFormValues,
	Review,
	ReviewFormValues,
	ServiceFormValues,
	ServiceItem,
	STATUS_COLOR,
	STATUS_LABEL,
	WEEK_DAYS,
} from './types';

const toMinutes = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
};

const formatMinutes = (totalMinutes: number) => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const DatLichDichVuPage: React.FC = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [services, setServices] = useState<ServiceItem[]>([]);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);

	const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
	const [serviceModalOpen, setServiceModalOpen] = useState(false);
	const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
	const [reviewModalOpen, setReviewModalOpen] = useState(false);
	const [replyModalOpen, setReplyModalOpen] = useState(false);

	const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
	const [editingService, setEditingService] = useState<ServiceItem | null>(null);
	const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
	const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);
	const [selectedReviewForReply, setSelectedReviewForReply] = useState<Review | null>(null);

	const [employeeForm] = Form.useForm<EmployeeFormValues>();
	const [serviceForm] = Form.useForm<ServiceFormValues>();
	const [appointmentForm] = Form.useForm<AppointmentFormValues>();
	const [reviewForm] = Form.useForm<ReviewFormValues>();
	const [replyForm] = Form.useForm<{ employeeReply: string }>();

	const [selectedMonth, setSelectedMonth] = useState<Moment>(moment());

	useEffect(() => {
		let mounted = true;
		const loadData = async () => {
			const state = await bookingService.loadState();
			if (!mounted) {
				return;
			}
			setEmployees(state.employees);
			setServices(state.services);
			setAppointments(state.appointments);
			setReviews(state.reviews);
		};

		void loadData();

		return () => {
			mounted = false;
		};
	}, []);

	const persistEmployees = (data: Employee[]) => {
		setEmployees(data);
		void bookingService.saveEmployees(data);
	};

	const persistServices = (data: ServiceItem[]) => {
		setServices(data);
		void bookingService.saveServices(data);
	};

	const persistAppointments = (data: Appointment[]) => {
		setAppointments(data);
		void bookingService.saveAppointments(data);
	};

	const persistReviews = (data: Review[]) => {
		setReviews(data);
		void bookingService.saveReviews(data);
	};

	const getServiceById = (id: string) => services.find((service) => service.id === id);
	const getEmployeeById = (id: string) => employees.find((employee) => employee.id === id);

	const validateAppointment = (
		payload: {
			employeeId: string;
			date: string;
			startTime: string;
			endTime: string;
		},
		excludedId?: string
	) => {
		const employee = getEmployeeById(payload.employeeId);
		if (!employee) {
			return 'Nhân viên không tồn tại';
		}

		const dayOfWeek = dayjs(payload.date).day();
		if (!employee.workDays.includes(dayOfWeek)) {
			return 'Nhân viên không làm việc trong ngày đã chọn';
		}

		const startMinute = toMinutes(payload.startTime);
		const endMinute = toMinutes(payload.endTime);
		const workStartMinute = toMinutes(employee.workStart);
		const workEndMinute = toMinutes(employee.workEnd);

		if (startMinute < workStartMinute || endMinute > workEndMinute) {
			return 'Lịch hẹn nằm ngoài giờ làm việc của nhân viên';
		}

		const sameDayAppointments = appointments.filter(
			(item) =>
				item.employeeId === payload.employeeId &&
				item.date === payload.date &&
				item.status !== 'cancelled' &&
				item.id !== excludedId
		);

		if (sameDayAppointments.length >= employee.maxCustomersPerDay) {
			return `Nhân viên đã đạt giới hạn ${employee.maxCustomersPerDay} khách/ngày`;
		}

		const isOverlap = sameDayAppointments.some((item) => {
			const itemStart = toMinutes(item.startTime);
			const itemEnd = toMinutes(item.endTime);
			return startMinute < itemEnd && endMinute > itemStart;
		});

		if (isOverlap) {
			return 'Khung giờ này đã bị trùng lịch';
		}

		return null;
	};

	const onOpenCreateEmployee = () => {
		setEditingEmployee(null);
		employeeForm.resetFields();
		employeeForm.setFieldsValue({
			workStart: moment('09:00', 'HH:mm'),
			workEnd: moment('17:00', 'HH:mm'),
			workDays: [1, 2, 3, 4, 5, 6],
			maxCustomersPerDay: 8,
		});
		setEmployeeModalOpen(true);
	};

	const onOpenEditEmployee = (employee: Employee) => {
		setEditingEmployee(employee);
		employeeForm.setFieldsValue({
			name: employee.name,
			workStart: moment(employee.workStart, 'HH:mm'),
			workEnd: moment(employee.workEnd, 'HH:mm'),
			workDays: employee.workDays,
			maxCustomersPerDay: employee.maxCustomersPerDay,
		});
		setEmployeeModalOpen(true);
	};

	const onSubmitEmployee = async () => {
		try {
			const values = await employeeForm.validateFields();
			const newEmployee: Employee = {
				id: editingEmployee?.id || uuidv4(),
				name: values.name,
				workStart: values.workStart.format('HH:mm'),
				workEnd: values.workEnd.format('HH:mm'),
				workDays: values.workDays,
				maxCustomersPerDay: values.maxCustomersPerDay,
				createdAt: editingEmployee?.createdAt || Date.now(),
			};

			if (toMinutes(newEmployee.workStart) >= toMinutes(newEmployee.workEnd)) {
				message.error('Giờ kết thúc phải lớn hơn giờ bắt đầu');
				return;
			}

			const next = editingEmployee
				? employees.map((item) => (item.id === editingEmployee.id ? newEmployee : item))
				: [...employees, newEmployee];

			persistEmployees(next);
			message.success(editingEmployee ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công');
			setEmployeeModalOpen(false);
			setEditingEmployee(null);
			employeeForm.resetFields();
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin nhân viên');
		}
	};

	const onDeleteEmployee = (id: string) => {
		const hasActiveAppointment = appointments.some(
			(item) => item.employeeId === id && item.status !== 'cancelled'
		);
		if (hasActiveAppointment) {
			message.error('Không thể xóa nhân viên còn lịch hẹn đang hoạt động');
			return;
		}
		persistEmployees(employees.filter((item) => item.id !== id));
		message.success('Xóa nhân viên thành công');
	};

	const onOpenCreateService = () => {
		setEditingService(null);
		serviceForm.resetFields();
		serviceForm.setFieldsValue({
			durationMinutes: 30,
			price: 100000,
		});
		setServiceModalOpen(true);
	};

	const onOpenEditService = (service: ServiceItem) => {
		setEditingService(service);
		serviceForm.setFieldsValue({
			name: service.name,
			durationMinutes: service.durationMinutes,
			price: service.price,
		});
		setServiceModalOpen(true);
	};

	const onSubmitService = async () => {
		try {
			const values = await serviceForm.validateFields();
			const newService: ServiceItem = {
				id: editingService?.id || uuidv4(),
				name: values.name,
				durationMinutes: values.durationMinutes,
				price: values.price,
				createdAt: editingService?.createdAt || Date.now(),
			};

			const next = editingService
				? services.map((item) => (item.id === editingService.id ? newService : item))
				: [...services, newService];

			persistServices(next);
			message.success(editingService ? 'Cập nhật dịch vụ thành công' : 'Thêm dịch vụ thành công');
			setServiceModalOpen(false);
			setEditingService(null);
			serviceForm.resetFields();
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin dịch vụ');
		}
	};

	const onDeleteService = (id: string) => {
		const hasUsedAppointment = appointments.some(
			(item) => item.serviceId === id && item.status !== 'cancelled'
		);
		if (hasUsedAppointment) {
			message.error('Không thể xóa dịch vụ đang có lịch hẹn');
			return;
		}
		persistServices(services.filter((item) => item.id !== id));
		message.success('Xóa dịch vụ thành công');
	};

	const onOpenCreateAppointment = () => {
		if (employees.length === 0 || services.length === 0) {
			message.error('Cần có ít nhất 1 nhân viên và 1 dịch vụ trước khi đặt lịch');
			return;
		}
		setEditingAppointment(null);
		appointmentForm.resetFields();
		appointmentForm.setFieldsValue({
			date: moment(),
			startTime: moment('09:00', 'HH:mm'),
			employeeId: employees[0].id,
			serviceId: services[0].id,
		});
		setAppointmentModalOpen(true);
	};

	const onOpenEditAppointment = (appointment: Appointment) => {
		setEditingAppointment(appointment);
		appointmentForm.setFieldsValue({
			customerName: appointment.customerName,
			phone: appointment.phone,
			date: moment(appointment.date, 'YYYY-MM-DD'),
			startTime: moment(appointment.startTime, 'HH:mm'),
			employeeId: appointment.employeeId,
			serviceId: appointment.serviceId,
			note: appointment.note,
		});
		setAppointmentModalOpen(true);
	};

	const onSubmitAppointment = async () => {
		try {
			const values = await appointmentForm.validateFields();
			const service = getServiceById(values.serviceId);
			if (!service) {
				message.error('Dịch vụ không tồn tại');
				return;
			}

			const startTime = values.startTime.format('HH:mm');
			const endMinute = toMinutes(startTime) + service.durationMinutes;
			if (endMinute > 24 * 60) {
				message.error('Thời gian kết thúc không hợp lệ');
				return;
			}

			const endTime = formatMinutes(endMinute);
			const date = values.date.format('YYYY-MM-DD');

			const validationError = validateAppointment(
				{
					employeeId: values.employeeId,
					date,
					startTime,
					endTime,
				},
				editingAppointment?.id
			);

			if (validationError) {
				message.error(validationError);
				return;
			}

			const newAppointment: Appointment = {
				id: editingAppointment?.id || uuidv4(),
				customerName: values.customerName,
				phone: values.phone,
				date,
				startTime,
				endTime,
				employeeId: values.employeeId,
				serviceId: values.serviceId,
				status: editingAppointment?.status || 'pending',
				note: values.note,
				createdAt: editingAppointment?.createdAt || Date.now(),
				updatedAt: Date.now(),
			};

			const next = editingAppointment
				? appointments.map((item) => (item.id === editingAppointment.id ? newAppointment : item))
				: [...appointments, newAppointment];

			persistAppointments(next);
			message.success(editingAppointment ? 'Cập nhật lịch hẹn thành công' : 'Đặt lịch thành công');
			setAppointmentModalOpen(false);
			setEditingAppointment(null);
			appointmentForm.resetFields();
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin lịch hẹn');
		}
	};

	const onUpdateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
		const next = appointments.map((item) =>
			item.id === appointmentId
				? {
						...item,
						status,
						updatedAt: Date.now(),
				  }
				: item
		);
		persistAppointments(next);
		message.success('Cập nhật trạng thái thành công');
	};

	const onDeleteAppointment = (id: string) => {
		persistAppointments(appointments.filter((item) => item.id !== id));
		persistReviews(reviews.filter((item) => item.appointmentId !== id));
		message.success('Xóa lịch hẹn thành công');
	};

	const completedAppointmentsWithoutReview = useMemo(() => {
		const reviewedAppointmentIds = new Set(reviews.map((item) => item.appointmentId));
		return appointments.filter(
			(item) => item.status === 'completed' && !reviewedAppointmentIds.has(item.id)
		);
	}, [appointments, reviews]);

	const onOpenReviewModal = (appointment: Appointment) => {
		setSelectedAppointmentForReview(appointment);
		reviewForm.resetFields();
		reviewForm.setFieldsValue({ rating: 5 });
		setReviewModalOpen(true);
	};

	const onSubmitReview = async () => {
		if (!selectedAppointmentForReview) {
			return;
		}
		try {
			const values = await reviewForm.validateFields();
			const payload: Review = {
				id: uuidv4(),
				appointmentId: selectedAppointmentForReview.id,
				employeeId: selectedAppointmentForReview.employeeId,
				serviceId: selectedAppointmentForReview.serviceId,
				rating: values.rating,
				comment: values.comment,
				createdAt: Date.now(),
			};
			persistReviews([...reviews, payload]);
			message.success('Đánh giá đã được ghi nhận');
			setReviewModalOpen(false);
			setSelectedAppointmentForReview(null);
			reviewForm.resetFields();
		} catch (error) {
			message.error('Vui lòng nhập đầy đủ thông tin đánh giá');
		}
	};

	const onOpenReplyModal = (review: Review) => {
		setSelectedReviewForReply(review);
		replyForm.setFieldsValue({ employeeReply: review.employeeReply || '' });
		setReplyModalOpen(true);
	};

	const onSubmitReply = async () => {
		if (!selectedReviewForReply) {
			return;
		}
		try {
			const values = await replyForm.validateFields();
			const next = reviews.map((item) =>
				item.id === selectedReviewForReply.id
					? {
							...item,
							employeeReply: values.employeeReply,
					  }
					: item
			);
			persistReviews(next);
			message.success('Đã lưu phản hồi');
			setReplyModalOpen(false);
			setSelectedReviewForReply(null);
		} catch (error) {
			message.error('Vui lòng nhập phản hồi');
		}
	};

	const employeeRatingSummary = useMemo(() => {
		return employees.map((employee) => {
			const employeeReviews = reviews.filter((item) => item.employeeId === employee.id);
			const total = employeeReviews.reduce((sum, item) => sum + item.rating, 0);
			const average = employeeReviews.length ? total / employeeReviews.length : 0;
			return {
				employee,
				count: employeeReviews.length,
				average,
			};
		});
	}, [employees, reviews]);

	const monthAppointments = useMemo(() => {
		const monthKey = selectedMonth.format('YYYY-MM');
		return appointments.filter((item) => item.date.startsWith(monthKey));
	}, [appointments, selectedMonth]);

	const dailyStats = useMemo(() => {
		const grouped: Record<string, number> = {};
		monthAppointments.forEach((item) => {
			grouped[item.date] = (grouped[item.date] || 0) + 1;
		});
		return Object.keys(grouped)
			.sort()
			.map((date) => ({ date, count: grouped[date] }));
	}, [monthAppointments]);

	const completedAppointments = useMemo(
		() => appointments.filter((item) => item.status === 'completed'),
		[appointments]
	);

	const revenueByService = useMemo(() => {
		const summary: Record<string, number> = {};
		completedAppointments.forEach((item) => {
			const service = getServiceById(item.serviceId);
			if (!service) {
				return;
			}
			summary[service.name] = (summary[service.name] || 0) + service.price;
		});
		return Object.keys(summary).map((name) => ({ name, revenue: summary[name] }));
	}, [completedAppointments, services]);

	const revenueByEmployee = useMemo(() => {
		const summary: Record<string, number> = {};
		completedAppointments.forEach((item) => {
			const employee = getEmployeeById(item.employeeId);
			const service = getServiceById(item.serviceId);
			if (!employee || !service) {
				return;
			}
			summary[employee.name] = (summary[employee.name] || 0) + service.price;
		});
		return Object.keys(summary).map((name) => ({ name, revenue: summary[name] }));
	}, [completedAppointments, employees, services]);

	const totalRevenue = useMemo(
		() => completedAppointments.reduce((sum, item) => sum + (getServiceById(item.serviceId)?.price || 0), 0),
		[completedAppointments, services]
	);

	const exportReport = () => {
		const wb = XLSX.utils.book_new();

		const dailySheetData = dailyStats.map((item) => ({
			Ngay: dayjs(item.date).format('DD/MM/YYYY'),
			SoLuongLichHen: item.count,
		}));
		const revenueServiceSheetData = revenueByService.map((item) => ({
			DichVu: item.name,
			DoanhThu: item.revenue,
		}));
		const revenueEmployeeSheetData = revenueByEmployee.map((item) => ({
			NhanVien: item.name,
			DoanhThu: item.revenue,
		}));

		XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dailySheetData), 'LichHenTheoNgay');
		XLSX.utils.book_append_sheet(
			wb,
			XLSX.utils.json_to_sheet(revenueServiceSheetData),
			'DoanhThuTheoDichVu'
		);
		XLSX.utils.book_append_sheet(
			wb,
			XLSX.utils.json_to_sheet(revenueEmployeeSheetData),
			'DoanhThuTheoNhanVien'
		);

		XLSX.writeFile(wb, `bao-cao-dat-lich-${selectedMonth.format('YYYY-MM')}.xlsx`);
		message.success('Đã xuất báo cáo Excel');
	};

	const employeeColumns = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Lịch làm việc',
			key: 'schedule',
			render: (_: unknown, record: Employee) => {
				const days = record.workDays
					.map((day) => WEEK_DAYS.find((item) => item.value === day)?.label)
					.filter(Boolean)
					.join(', ');
				return (
					<div>
						<div>{`${record.workStart} - ${record.workEnd}`}</div>
						<div style={{ color: '#8c8c8c' }}>{days}</div>
					</div>
				);
			},
		},
		{
			title: 'Giới hạn khách/ngày',
			dataIndex: 'maxCustomersPerDay',
			key: 'maxCustomersPerDay',
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: Employee) => (
				<Space>
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onOpenEditEmployee(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa nhân viên này?" onConfirm={() => onDeleteEmployee(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const serviceColumns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Thời gian thực hiện',
			dataIndex: 'durationMinutes',
			key: 'durationMinutes',
			render: (value: number) => `${value} phút`,
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: ServiceItem) => (
				<Space>
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onOpenEditService(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa dịch vụ này?" onConfirm={() => onDeleteService(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const appointmentColumns = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
		},
		{
			title: 'Điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Ngày giờ',
			key: 'time',
			render: (_: unknown, record: Appointment) => `${dayjs(record.date).format('DD/MM/YYYY')} ${record.startTime} - ${record.endTime}`,
		},
		{
			title: 'Nhân viên',
			key: 'employee',
			render: (_: unknown, record: Appointment) => getEmployeeById(record.employeeId)?.name || '-',
		},
		{
			title: 'Dịch vụ',
			key: 'service',
			render: (_: unknown, record: Appointment) => getServiceById(record.serviceId)?.name || '-',
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: unknown, record: Appointment) => (
				<Select
					value={record.status}
					onChange={(value: AppointmentStatus) => onUpdateAppointmentStatus(record.id, value)}
					style={{ width: 130 }}
				>
					{(Object.keys(STATUS_LABEL) as AppointmentStatus[]).map((status) => (
						<Select.Option key={status} value={status}>
							<Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>
						</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: Appointment) => (
				<Space>
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onOpenEditAppointment(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa lịch hẹn này?" onConfirm={() => onDeleteAppointment(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const reviewColumns = [
		{
			title: 'Lịch hẹn',
			key: 'appointment',
			render: (_: unknown, record: Review) => {
				const appointment = appointments.find((item) => item.id === record.appointmentId);
				if (!appointment) {
					return '-';
				}
				return `${appointment.customerName} - ${dayjs(appointment.date).format('DD/MM/YYYY')}`;
			},
		},
		{
			title: 'Nhân viên',
			key: 'employee',
			render: (_: unknown, record: Review) => getEmployeeById(record.employeeId)?.name || '-',
		},
		{
			title: 'Dịch vụ',
			key: 'service',
			render: (_: unknown, record: Review) => getServiceById(record.serviceId)?.name || '-',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			render: (rating: number) => <Rate disabled value={rating} />,
		},
		{
			title: 'Nhận xét',
			dataIndex: 'comment',
			key: 'comment',
		},
		{
			title: 'Phản hồi',
			key: 'reply',
			render: (_: unknown, record: Review) => (
				<div>
					<div>{record.employeeReply || '-'}</div>
					<Button
						type="link"
						size="small"
						icon={<MessageOutlined />}
						onClick={() => onOpenReplyModal(record)}
					>
						{record.employeeReply ? 'Sửa phản hồi' : 'Phản hồi'}
					</Button>
				</div>
			),
		},
	];

	return (
		<div style={{ padding: 20 }}>
			<h1>Quản lý đặt lịch dịch vụ</h1>
			<Tabs defaultActiveKey="1">
				<Tabs.TabPane tab="1. Nhân viên và dịch vụ" key="1">
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card
								title="Danh sách nhân viên"
								extra={
									<Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreateEmployee}>
										Thêm nhân viên
									</Button>
								}
							>
								<Table<Employee>
									dataSource={employees}
									columns={employeeColumns}
									rowKey="id"
									pagination={false}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card
								title="Danh sách dịch vụ"
								extra={
									<Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreateService}>
										Thêm dịch vụ
									</Button>
								}
							>
								<Table<ServiceItem>
									dataSource={services}
									columns={serviceColumns}
									rowKey="id"
									pagination={false}
								/>
							</Card>
						</Col>
					</Row>
				</Tabs.TabPane>

				<Tabs.TabPane tab="2. Quản lý lịch hẹn" key="2">
					<Card
						title="Lịch hẹn"
						extra={
							<Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreateAppointment}>
								Đặt lịch
							</Button>
						}
					>
						<Table<Appointment>
							dataSource={[...appointments].sort((a, b) =>
								`${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
							)}
							columns={appointmentColumns}
							rowKey="id"
						/>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab="3. Đánh giá dịch vụ" key="3">
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={10}>
							<Card title="Lịch hẹn đã hoàn thành chưa đánh giá">
								<Table<Appointment>
									dataSource={completedAppointmentsWithoutReview}
									rowKey="id"
									pagination={{ pageSize: 5 }}
									columns={[
										{
											title: 'Khách hàng',
											dataIndex: 'customerName',
											key: 'customerName',
										},
										{
											title: 'Ngày',
											key: 'date',
											render: (_: unknown, record: Appointment) => dayjs(record.date).format('DD/MM/YYYY'),
										},
										{
											title: '',
											key: 'action',
											render: (_: unknown, record: Appointment) => (
												<Button type="primary" size="small" onClick={() => onOpenReviewModal(record)}>
													Đánh giá
												</Button>
											),
										},
									]}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={14}>
							<Card title="Danh sách đánh giá và phản hồi">
								<Table<Review>
									dataSource={reviews}
									columns={reviewColumns}
									rowKey="id"
									pagination={{ pageSize: 5 }}
								/>
							</Card>
						</Col>
					</Row>

					<Card title="Điểm trung bình theo nhân viên" style={{ marginTop: 16 }}>
						<Row gutter={[16, 16]}>
							{employeeRatingSummary.map((item) => (
								<Col xs={24} md={12} lg={8} key={item.employee.id}>
									<Card size="small">
										<Statistic title={item.employee.name} value={Number(item.average.toFixed(2))} suffix="/ 5" />
										<Rate disabled value={item.average} allowHalf style={{ fontSize: 16 }} />
										<div style={{ color: '#8c8c8c', marginTop: 8 }}>{item.count} lượt đánh giá</div>
									</Card>
								</Col>
							))}
						</Row>
					</Card>
				</Tabs.TabPane>

				<Tabs.TabPane tab="4. Thống kê và báo cáo" key="4">
					<div style={{ marginBottom: 16, textAlign: 'right' }}>
						<Button type="primary" onClick={exportReport}>
							Xuất báo cáo Excel
						</Button>
					</div>
					<Row gutter={[16, 16]}>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Tổng lịch hẹn" value={appointments.length} />
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Lịch hẹn hoàn thành" value={completedAppointments.length} />
							</Card>
						</Col>
						<Col xs={24} md={8}>
							<Card>
								<Statistic title="Doanh thu" value={totalRevenue} precision={0} suffix="đ" />
							</Card>
						</Col>
					</Row>

					<Card title="Thống kê lịch hẹn theo ngày/tháng" style={{ marginTop: 16 }}>
						<Space style={{ marginBottom: 16 }}>
							<span>Chọn tháng:</span>
							<DatePicker picker="month" value={selectedMonth} onChange={(value) => value && setSelectedMonth(value)} />
						</Space>
						<Table<{ date: string; count: number }>
							rowKey="date"
							dataSource={dailyStats}
							pagination={false}
							columns={[
								{
									title: 'Ngày',
									dataIndex: 'date',
									key: 'date',
									render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
								},
								{
									title: 'Số lịch hẹn',
									dataIndex: 'count',
									key: 'count',
								},
							]}
						/>
					</Card>

					<Row gutter={[16, 16]} style={{ marginTop: 8 }}>
						<Col xs={24} lg={12}>
							<Card title="Doanh thu theo dịch vụ">
								<Table<{ name: string; revenue: number }>
									rowKey="name"
									dataSource={revenueByService}
									pagination={false}
									columns={[
										{
											title: 'Dịch vụ',
											dataIndex: 'name',
											key: 'name',
										},
										{
											title: 'Doanh thu',
											dataIndex: 'revenue',
											key: 'revenue',
											render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
										},
									]}
								/>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title="Doanh thu theo nhân viên">
								<Table<{ name: string; revenue: number }>
									rowKey="name"
									dataSource={revenueByEmployee}
									pagination={false}
									columns={[
										{
											title: 'Nhân viên',
											dataIndex: 'name',
											key: 'name',
										},
										{
											title: 'Doanh thu',
											dataIndex: 'revenue',
											key: 'revenue',
											render: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
										},
									]}
								/>
							</Card>
						</Col>
					</Row>
				</Tabs.TabPane>
			</Tabs>

			<Modal
				title={editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
				visible={employeeModalOpen}
				onCancel={() => setEmployeeModalOpen(false)}
				onOk={onSubmitEmployee}
			>
				<Form<EmployeeFormValues> form={employeeForm} layout="vertical">
					<Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: 'Nhập tên nhân viên' }]}> 
						<Input placeholder="Ví dụ: Trần Thị Mai" />
					</Form.Item>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item
								label="Giờ bắt đầu"
								name="workStart"
								rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
							>
								<TimePicker format="HH:mm" style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Giờ kết thúc"
								name="workEnd"
								rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}
							>
								<TimePicker format="HH:mm" style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						label="Ngày làm việc"
						name="workDays"
						rules={[{ required: true, message: 'Chọn ít nhất 1 ngày làm việc' }]}
					>
						<Select mode="multiple" options={WEEK_DAYS} />
					</Form.Item>
					<Form.Item
						label="Giới hạn số khách/ngày"
						name="maxCustomersPerDay"
						rules={[{ required: true, message: 'Nhập giới hạn khách/ngày' }]}
					>
						<InputNumber min={1} max={100} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
				visible={serviceModalOpen}
				onCancel={() => setServiceModalOpen(false)}
				onOk={onSubmitService}
			>
				<Form<ServiceFormValues> form={serviceForm} layout="vertical">
					<Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}> 
						<Input placeholder="Ví dụ: Chăm sóc da cơ bản" />
					</Form.Item>
					<Form.Item
						label="Thời gian thực hiện (phút)"
						name="durationMinutes"
						rules={[{ required: true, message: 'Nhập thời gian thực hiện' }]}
					>
						<InputNumber min={5} max={600} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label="Giá dịch vụ" name="price" rules={[{ required: true, message: 'Nhập giá dịch vụ' }]}> 
						<InputNumber min={1000} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingAppointment ? 'Sửa lịch hẹn' : 'Đặt lịch mới'}
				visible={appointmentModalOpen}
				onCancel={() => setAppointmentModalOpen(false)}
				onOk={onSubmitAppointment}
				width={700}
			>
				<Form<AppointmentFormValues> form={appointmentForm} layout="vertical">
					<Row gutter={12}>
						<Col xs={24} md={12}>
							<Form.Item
								label="Tên khách hàng"
								name="customerName"
								rules={[{ required: true, message: 'Nhập tên khách hàng' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label="Số điện thoại"
								name="phone"
								rules={[
									{ required: true, message: 'Nhập số điện thoại' },
									{ pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={24} md={12}>
							<Form.Item label="Ngày hẹn" name="date" rules={[{ required: true, message: 'Chọn ngày hẹn' }]}> 
								<DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label="Giờ bắt đầu"
								name="startTime"
								rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
							>
								<TimePicker format="HH:mm" style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={24} md={12}>
							<Form.Item
								label="Nhân viên phục vụ"
								name="employeeId"
								rules={[{ required: true, message: 'Chọn nhân viên' }]}
							>
								<Select
									options={employees.map((item) => ({
										label: item.name,
										value: item.id,
									}))}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label="Dịch vụ"
								name="serviceId"
								rules={[{ required: true, message: 'Chọn dịch vụ' }]}
							>
								<Select
									options={services.map((item) => ({
										label: `${item.name} (${item.durationMinutes} phút)`,
										value: item.id,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label="Ghi chú" name="note">
						<Input.TextArea rows={3} placeholder="Yêu cầu đặc biệt của khách hàng" />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Đánh giá dịch vụ"
				visible={reviewModalOpen}
				onCancel={() => setReviewModalOpen(false)}
				onOk={onSubmitReview}
			>
				<Form<ReviewFormValues> form={reviewForm} layout="vertical">
					<Form.Item
						label="Số sao"
						name="rating"
						rules={[{ required: true, message: 'Chọn số sao đánh giá' }]}
					>
						<Rate />
					</Form.Item>
					<Form.Item
						label="Nhận xét"
						name="comment"
						rules={[{ required: true, message: 'Nhập nhận xét' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Phản hồi đánh giá"
				visible={replyModalOpen}
				onCancel={() => setReplyModalOpen(false)}
				onOk={onSubmitReply}
			>
				<Form form={replyForm} layout="vertical">
					<Form.Item
						label="Nội dung phản hồi"
						name="employeeReply"
						rules={[{ required: true, message: 'Nhập phản hồi của nhân viên' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DatLichDichVuPage;
