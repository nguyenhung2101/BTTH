import { v4 as uuidv4 } from 'uuid';
import {
	Appointment,
	BookingState,
	Employee,
	Review,
	ServiceItem,
	STORAGE_KEYS,
} from './types';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultEmployees = (): Employee[] => [
	{
		id: uuidv4(),
		name: 'Nguyen Van An',
		workStart: '09:00',
		workEnd: '17:00',
		workDays: [1, 2, 3, 4, 5, 6],
		maxCustomersPerDay: 8,
		createdAt: Date.now(),
	},
];

const defaultServices = (): ServiceItem[] => [
	{
		id: uuidv4(),
		name: 'Cat toc nam',
		durationMinutes: 45,
		price: 120000,
		createdAt: Date.now(),
	},
	{
		id: uuidv4(),
		name: 'Goi dau thu gian',
		durationMinutes: 30,
		price: 80000,
		createdAt: Date.now(),
	},
];

const loadArray = <T,>(key: string): T[] => {
	const raw = localStorage.getItem(key);
	if (!raw) {
		return [];
	}
	try {
		return JSON.parse(raw);
	} catch {
		return [];
	}
};

export const bookingService = {
	async loadState(): Promise<BookingState> {
		await delay();

		let employees = loadArray<Employee>(STORAGE_KEYS.employees);
		let services = loadArray<ServiceItem>(STORAGE_KEYS.services);
		const appointments = loadArray<Appointment>(STORAGE_KEYS.appointments);
		const reviews = loadArray<Review>(STORAGE_KEYS.reviews);

		if (employees.length === 0) {
			employees = defaultEmployees();
			localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
		}

		if (services.length === 0) {
			services = defaultServices();
			localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
		}

		return {
			employees,
			services,
			appointments,
			reviews,
		};
	},

	async saveEmployees(data: Employee[]) {
		await delay();
		localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(data));
	},

	async saveServices(data: ServiceItem[]) {
		await delay();
		localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(data));
	},

	async saveAppointments(data: Appointment[]) {
		await delay();
		localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(data));
	},

	async saveReviews(data: Review[]) {
		await delay();
		localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(data));
	},
};
