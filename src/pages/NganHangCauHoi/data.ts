// Shared data layer using localStorage for all NganHangCauHoi pages

export interface KhoiKienThuc {
	id: string;
	maKhoi: string;
	tenKhoi: string;
}

export interface MonHoc {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
}

export type MucDoKho = 'De' | 'TrungBinh' | 'Kho' | 'RatKho';

export const MUC_DO_KHO_LABEL: Record<MucDoKho, string> = {
	De: 'Dễ',
	TrungBinh: 'Trung bình',
	Kho: 'Khó',
	RatKho: 'Rất khó',
};

export const MUC_DO_KHO_COLOR: Record<MucDoKho, string> = {
	De: 'green',
	TrungBinh: 'blue',
	Kho: 'orange',
	RatKho: 'red',
};

export interface CauHoi {
	id: string;
	maCauHoi: string;
	monHocId: string;
	noiDung: string;
	mucDoKho: MucDoKho;
	khoiKienThucId: string;
}

export interface CauTrucDeThi {
	khoiKienThucId: string;
	mucDoKho: MucDoKho;
	soLuong: number;
}

export interface DeThi {
	id: string;
	maDe: string;
	monHocId: string;
	cauTruc: CauTrucDeThi[];
	danhSachCauHoi: string[]; // ids
	ngayTao: string;
}

// --- KHOI KIEN THUC ---
const KEY_KKT = 'ngan_hang_khoi_kien_thuc';

export const getKhoiKienThucs = (): KhoiKienThuc[] => {
	try {
		const data = localStorage.getItem(KEY_KKT);
		if (data) return JSON.parse(data);
	} catch {}
	const defaults: KhoiKienThuc[] = [
		{ id: '1', maKhoi: 'KKT001', tenKhoi: 'Tổng quan' },
		{ id: '2', maKhoi: 'KKT002', tenKhoi: 'Chuyên sâu' },
		{ id: '3', maKhoi: 'KKT003', tenKhoi: 'Ứng dụng' },
	];
	saveKhoiKienThucs(defaults);
	return defaults;
};

export const saveKhoiKienThucs = (data: KhoiKienThuc[]) => {
	localStorage.setItem(KEY_KKT, JSON.stringify(data));
};

// --- MON HOC ---
const KEY_MH = 'ngan_hang_mon_hoc';

export const getMonHocs = (): MonHoc[] => {
	try {
		const data = localStorage.getItem(KEY_MH);
		if (data) return JSON.parse(data);
	} catch {}
	const defaults: MonHoc[] = [
		{ id: '1', maMon: 'MH001', tenMon: 'Lập trình hướng đối tượng', soTinChi: 3 },
		{ id: '2', maMon: 'MH002', tenMon: 'Cơ sở dữ liệu', soTinChi: 3 },
		{ id: '3', maMon: 'MH003', tenMon: 'Mạng máy tính', soTinChi: 2 },
	];
	saveMonHocs(defaults);
	return defaults;
};

export const saveMonHocs = (data: MonHoc[]) => {
	localStorage.setItem(KEY_MH, JSON.stringify(data));
};

// --- CAU HOI ---
const KEY_CH = 'ngan_hang_cau_hoi';

export const getCauHois = (): CauHoi[] => {
	try {
		const data = localStorage.getItem(KEY_CH);
		if (data) return JSON.parse(data);
	} catch {}
	const defaults: CauHoi[] = [
		{ id: '1', maCauHoi: 'CH001', monHocId: '1', noiDung: 'Trình bày khái niệm lớp và đối tượng trong OOP?', mucDoKho: 'De', khoiKienThucId: '1' },
		{ id: '2', maCauHoi: 'CH002', monHocId: '1', noiDung: 'Phân tích và so sánh tính kế thừa và đa hình trong OOP?', mucDoKho: 'Kho', khoiKienThucId: '2' },
		{ id: '3', maCauHoi: 'CH003', monHocId: '2', noiDung: 'Khái niệm cơ sở dữ liệu quan hệ là gì?', mucDoKho: 'De', khoiKienThucId: '1' },
		{ id: '4', maCauHoi: 'CH004', monHocId: '2', noiDung: 'Trình bày các dạng chuẩn hóa cơ sở dữ liệu (1NF, 2NF, 3NF)?', mucDoKho: 'RatKho', khoiKienThucId: '2' },
		{ id: '5', maCauHoi: 'CH005', monHocId: '1', noiDung: 'Thiết kế một lớp Stack sử dụng OOP?', mucDoKho: 'TrungBinh', khoiKienThucId: '3' },
	];
	saveCauHois(defaults);
	return defaults;
};

export const saveCauHois = (data: CauHoi[]) => {
	localStorage.setItem(KEY_CH, JSON.stringify(data));
};

// --- DE THI ---
const KEY_DT = 'ngan_hang_de_thi';

export const getDeThi = (): DeThi[] => {
	try {
		const data = localStorage.getItem(KEY_DT);
		if (data) return JSON.parse(data);
	} catch {}
	return [];
};

export const saveDeThi = (data: DeThi[]) => {
	localStorage.setItem(KEY_DT, JSON.stringify(data));
};

export const generateId = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);
