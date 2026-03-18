import { Moment } from 'moment';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Employee {
	id: string;
	name: string;
	workStart: string;
	workEnd: string;
	workDays: number[];
	maxCustomersPerDay: number;
	createdAt: number;
}

export interface ServiceItem {
	id: string;
	name: string;
	durationMinutes: number;
	price: number;
	createdAt: number;
}

export interface Appointment {
	id: string;
	customerName: string;
	phone: string;
	date: string;
	startTime: string;
	endTime: string;
	employeeId: string;
	serviceId: string;
	status: AppointmentStatus;
	note?: string;
	createdAt: number;
	updatedAt: number;
}

export interface Review {
	id: string;
	appointmentId: string;
	employeeId: string;
	serviceId: string;
	rating: number;
	comment: string;
	employeeReply?: string;
	createdAt: number;
}

export interface EmployeeFormValues {
	name: string;
	workStart: Moment;
	workEnd: Moment;
	workDays: number[];
	maxCustomersPerDay: number;
}

export interface ServiceFormValues {
	name: string;
	durationMinutes: number;
	price: number;
}

export interface AppointmentFormValues {
	customerName: string;
	phone: string;
	date: Moment;
	startTime: Moment;
	employeeId: string;
	serviceId: string;
	note?: string;
}

export interface ReviewFormValues {
	rating: number;
	comment: string;
}

export interface BookingState {
	employees: Employee[];
	services: ServiceItem[];
	appointments: Appointment[];
	reviews: Review[];
}

export const STORAGE_KEYS = {
	employees: 'booking_employees',
	services: 'booking_services',
	appointments: 'booking_appointments',
	reviews: 'booking_reviews',
};

export const WEEK_DAYS = [
	{ label: 'Chủ nhật', value: 0 },
	{ label: 'Thứ 2', value: 1 },
	{ label: 'Thứ 3', value: 2 },
	{ label: 'Thứ 4', value: 3 },
	{ label: 'Thứ 5', value: 4 },
	{ label: 'Thứ 6', value: 5 },
	{ label: 'Thứ 7', value: 6 },
];

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
	pending: 'Chờ duyệt',
	confirmed: 'Xác nhận',
	completed: 'Hoàn thành',
	cancelled: 'Hủy',
};

export const STATUS_COLOR: Record<AppointmentStatus, string> = {
	pending: 'orange',
	confirmed: 'blue',
	completed: 'green',
	cancelled: 'red',
};
