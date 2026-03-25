import {
	Button,
	Card,
	Col,
	DatePicker,
	Descriptions,
	Divider,
	Empty,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tabs,
	Tag,
	message,
} from 'antd';
import {
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

type FieldDataType = 'string' | 'number' | 'date';

interface SoVanBang {
	id: string;
	nam: number;
	maSo: string;
	createdAt: number;
}

interface QuyetDinhTotNghiep {
	id: string;
	soQuyetDinh: string;
	ngayBanHanh: string;
	trichYeu: string;
	soVanBangId: string;
	lookupCount: number;
	createdAt: number;
}

interface TruongDuLieu {
	id: string;
	key: string;
	label: string;
	kieuDuLieu: FieldDataType;
	createdAt: number;
}

interface VanBang {
	id: string;
	soVanBangId: string;
	quyetDinhId: string;
	soVaoSo: number;
	soHieuVanBang: string;
	maSinhVien: string;
	hoTen: string;
	ngaySinh: string;
	duLieuMoRong: Record<string, string | number>;
	createdAt: number;
}

const STORAGE_KEYS = {
	soVanBangs: 'vanbang_sovanbangs',
	quyetDinhs: 'vanbang_quyetdinhs',
	truongDuLieus: 'vanbang_truongdulieus',
	vanBangs: 'vanbang_records',
};

const DEFAULT_TRUONG_DU_LIEU: TruongDuLieu[] = [
	{ id: uuidv4(), key: 'diem_trung_binh', label: 'Điểm trung bình', kieuDuLieu: 'number', createdAt: Date.now() },
	{ id: uuidv4(), key: 'xep_hang', label: 'Xếp hạng', kieuDuLieu: 'string', createdAt: Date.now() },
	{ id: uuidv4(), key: 'he_dao_tao', label: 'Hệ đào tạo', kieuDuLieu: 'string', createdAt: Date.now() },
];

const QuanLyHocTapPage: React.FC = () => {
	const [soVanBangs, setSoVanBangs] = useState<SoVanBang[]>([]);
	const [quyetDinhs, setQuyetDinhs] = useState<QuyetDinhTotNghiep[]>([]);
	const [truongDuLieus, setTruongDuLieus] = useState<TruongDuLieu[]>([]);
	const [vanBangs, setVanBangs] = useState<VanBang[]>([]);

	const [bookModalVisible, setBookModalVisible] = useState(false);
	const [decisionModalVisible, setDecisionModalVisible] = useState(false);
	const [fieldModalVisible, setFieldModalVisible] = useState(false);
	const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);
	const [detailModalVisible, setDetailModalVisible] = useState(false);

	const [editingBook, setEditingBook] = useState<SoVanBang | null>(null);
	const [editingDecision, setEditingDecision] = useState<QuyetDinhTotNghiep | null>(null);
	const [editingField, setEditingField] = useState<TruongDuLieu | null>(null);
	const [editingDiploma, setEditingDiploma] = useState<VanBang | null>(null);
	const [viewingDiploma, setViewingDiploma] = useState<VanBang | null>(null);

	const [searchResults, setSearchResults] = useState<VanBang[]>([]);

	const [bookForm] = Form.useForm();
	const [decisionForm] = Form.useForm();
	const [fieldForm] = Form.useForm();
	const [diplomaForm] = Form.useForm();
	const [searchForm] = Form.useForm();

	useEffect(() => {
		const savedSoVanBangs = localStorage.getItem(STORAGE_KEYS.soVanBangs);
		const savedQuyetDinhs = localStorage.getItem(STORAGE_KEYS.quyetDinhs);
		const savedTruongDuLieus = localStorage.getItem(STORAGE_KEYS.truongDuLieus);
		const savedVanBangs = localStorage.getItem(STORAGE_KEYS.vanBangs);

		setSoVanBangs(savedSoVanBangs ? JSON.parse(savedSoVanBangs) : []);
		setQuyetDinhs(savedQuyetDinhs ? JSON.parse(savedQuyetDinhs) : []);
		setTruongDuLieus(savedTruongDuLieus ? JSON.parse(savedTruongDuLieus) : DEFAULT_TRUONG_DU_LIEU);
		setVanBangs(savedVanBangs ? JSON.parse(savedVanBangs) : []);
	}, []);

	const persistSoVanBangs = (data: SoVanBang[]) => {
		setSoVanBangs(data);
		localStorage.setItem(STORAGE_KEYS.soVanBangs, JSON.stringify(data));
	};

	const persistQuyetDinhs = (data: QuyetDinhTotNghiep[]) => {
		setQuyetDinhs(data);
		localStorage.setItem(STORAGE_KEYS.quyetDinhs, JSON.stringify(data));
	};

	const persistTruongDuLieus = (data: TruongDuLieu[]) => {
		setTruongDuLieus(data);
		localStorage.setItem(STORAGE_KEYS.truongDuLieus, JSON.stringify(data));
	};

	const persistVanBangs = (data: VanBang[]) => {
		setVanBangs(data);
		localStorage.setItem(STORAGE_KEYS.vanBangs, JSON.stringify(data));
	};

	const getSoVanBangName = (id: string) => {
		const soVanBang = soVanBangs.find((item) => item.id === id);
		if (!soVanBang) {
			return 'Không xác định';
		}
		return `${soVanBang.maSo} - Năm ${soVanBang.nam}`;
	};

	const getQuyetDinhName = (id: string) => {
		const quyetDinh = quyetDinhs.find((item) => item.id === id);
		if (!quyetDinh) {
			return 'Không xác định';
		}
		return `${quyetDinh.soQuyetDinh} (${dayjs(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')})`;
	};

	const getNextSoVaoSo = (soVanBangId: string) => {
		const relatedRecords = vanBangs.filter((item) => item.soVanBangId === soVanBangId);
		if (relatedRecords.length === 0) {
			return 1;
		}
		return Math.max(...relatedRecords.map((item) => item.soVaoSo)) + 1;
	};

	const selectedDecisionId = Form.useWatch('quyetDinhId', diplomaForm);
	const selectedDecision = useMemo(
		() => quyetDinhs.find((item) => item.id === selectedDecisionId),
		[quyetDinhs, selectedDecisionId]
	);

	const previewSoVaoSo = useMemo(() => {
		if (editingDiploma) {
			return editingDiploma.soVaoSo;
		}
		if (!selectedDecision) {
			return undefined;
		}
		return getNextSoVaoSo(selectedDecision.soVanBangId);
	}, [editingDiploma, selectedDecision, vanBangs]);

	const openCreateBook = () => {
		setEditingBook(null);
		bookForm.resetFields();
		bookForm.setFieldsValue({ nam: dayjs().year() });
		setBookModalVisible(true);
	};

	const openEditBook = (record: SoVanBang) => {
		setEditingBook(record);
		bookForm.setFieldsValue(record);
		setBookModalVisible(true);
	};

	const handleSaveBook = async () => {
		try {
			const values = await bookForm.validateFields();
			const duplicatedYear = soVanBangs.some(
				(item) => item.nam === values.nam && item.id !== editingBook?.id
			);
			if (duplicatedYear) {
				message.error('Mỗi năm chỉ được có 1 sổ văn bằng');
				return;
			}

			if (editingBook) {
				const updated = soVanBangs.map((item) =>
					item.id === editingBook.id ? { ...item, ...values } : item
				);
				persistSoVanBangs(updated);
				message.success('Cập nhật sổ văn bằng thành công');
			} else {
				const created: SoVanBang = {
					id: uuidv4(),
					nam: values.nam,
					maSo: values.maSo,
					createdAt: Date.now(),
				};
				persistSoVanBangs([...soVanBangs, created]);
				message.success('Tạo sổ văn bằng thành công');
			}
			setBookModalVisible(false);
			setEditingBook(null);
			bookForm.resetFields();
		} catch (error) {
			message.error('Vui lòng nhập đầy đủ thông tin sổ văn bằng');
		}
	};

	const handleDeleteBook = (id: string) => {
		const usedByDecision = quyetDinhs.some((item) => item.soVanBangId === id);
		if (usedByDecision) {
			message.error('Không thể xóa sổ văn bằng đang được sử dụng bởi quyết định tốt nghiệp');
			return;
		}
		persistSoVanBangs(soVanBangs.filter((item) => item.id !== id));
		message.success('Xóa sổ văn bằng thành công');
	};

	const openCreateDecision = () => {
		setEditingDecision(null);
		decisionForm.resetFields();
		setDecisionModalVisible(true);
	};

	const openEditDecision = (record: QuyetDinhTotNghiep) => {
		setEditingDecision(record);
		decisionForm.setFieldsValue({
			...record,
			ngayBanHanh: dayjs(record.ngayBanHanh),
		});
		setDecisionModalVisible(true);
	};

	const handleSaveDecision = async () => {
		try {
			const values = await decisionForm.validateFields();
			if (editingDecision) {
				const updated = quyetDinhs.map((item) =>
					item.id === editingDecision.id
						? {
								...item,
								...values,
								ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
						  }
						: item
				);
				persistQuyetDinhs(updated);
				message.success('Cập nhật quyết định thành công');
			} else {
				const created: QuyetDinhTotNghiep = {
					id: uuidv4(),
					soQuyetDinh: values.soQuyetDinh,
					ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
					trichYeu: values.trichYeu,
					soVanBangId: values.soVanBangId,
					lookupCount: 0,
					createdAt: Date.now(),
				};
				persistQuyetDinhs([...quyetDinhs, created]);
				message.success('Thêm quyết định thành công');
			}

			setDecisionModalVisible(false);
			setEditingDecision(null);
			decisionForm.resetFields();
		} catch (error) {
			message.error('Vui lòng nhập đầy đủ thông tin quyết định');
		}
	};

	const handleDeleteDecision = (id: string) => {
		const usedByDiploma = vanBangs.some((item) => item.quyetDinhId === id);
		if (usedByDiploma) {
			message.error('Không thể xóa quyết định đã có văn bằng');
			return;
		}
		persistQuyetDinhs(quyetDinhs.filter((item) => item.id !== id));
		message.success('Xóa quyết định thành công');
	};

	const openCreateField = () => {
		setEditingField(null);
		fieldForm.resetFields();
		setFieldModalVisible(true);
	};

	const openEditField = (record: TruongDuLieu) => {
		setEditingField(record);
		fieldForm.setFieldsValue(record);
		setFieldModalVisible(true);
	};

	const handleSaveField = async () => {
		try {
			const values = await fieldForm.validateFields();
			const normalizedKey = values.key.trim().toLowerCase();
			const duplicated = truongDuLieus.some(
				(item) => item.key === normalizedKey && item.id !== editingField?.id
			);
			if (duplicated) {
				message.error('Khóa trường đã tồn tại, vui lòng chọn khóa khác');
				return;
			}

			if (editingField) {
				const updated = truongDuLieus.map((item) =>
					item.id === editingField.id
						? {
								...item,
								label: values.label,
								key: normalizedKey,
								kieuDuLieu: values.kieuDuLieu,
						  }
						: item
				);
				persistTruongDuLieus(updated);
				message.success('Cập nhật cấu hình trường thành công');
			} else {
				const created: TruongDuLieu = {
					id: uuidv4(),
					label: values.label,
					key: normalizedKey,
					kieuDuLieu: values.kieuDuLieu,
					createdAt: Date.now(),
				};
				persistTruongDuLieus([...truongDuLieus, created]);
				message.success('Thêm trường dữ liệu thành công');
			}

			setFieldModalVisible(false);
			setEditingField(null);
			fieldForm.resetFields();
		} catch (error) {
			message.error('Vui lòng điền đúng thông tin trường dữ liệu');
		}
	};

	const handleDeleteField = (id: string) => {
		const usedByData = vanBangs.some((item) => item.duLieuMoRong[id] !== undefined);
		if (usedByData) {
			message.error('Không thể xóa trường đã có dữ liệu trong văn bằng');
			return;
		}
		persistTruongDuLieus(truongDuLieus.filter((item) => item.id !== id));
		message.success('Xóa trường dữ liệu thành công');
	};

	const openCreateDiploma = () => {
		if (quyetDinhs.length === 0) {
			message.warning('Bạn cần tạo quyết định tốt nghiệp trước khi thêm văn bằng');
			return;
		}
		setEditingDiploma(null);
		diplomaForm.resetFields();
		setDiplomaModalVisible(true);
	};

	const openEditDiploma = (record: VanBang) => {
		setEditingDiploma(record);
		const dynamicValues: Record<string, any> = {};
		truongDuLieus.forEach((field) => {
			const value = record.duLieuMoRong[field.id];
			if (value === undefined || value === null || value === '') {
				dynamicValues[field.id] = undefined;
				return;
			}
			dynamicValues[field.id] =
				field.kieuDuLieu === 'date' ? dayjs(value as string, 'YYYY-MM-DD') : value;
		});

		diplomaForm.setFieldsValue({
			quyetDinhId: record.quyetDinhId,
			soHieuVanBang: record.soHieuVanBang,
			maSinhVien: record.maSinhVien,
			hoTen: record.hoTen,
			ngaySinh: dayjs(record.ngaySinh, 'YYYY-MM-DD'),
			duLieuMoRong: dynamicValues,
		});
		setDiplomaModalVisible(true);
	};

	const handleSaveDiploma = async () => {
		try {
			const values = await diplomaForm.validateFields();
			const selected = quyetDinhs.find((item) => item.id === values.quyetDinhId);
			if (!selected) {
				message.error('Quyết định tốt nghiệp không hợp lệ');
				return;
			}

			const duplicatedSoHieu = vanBangs.some(
				(item) =>
					item.soHieuVanBang.trim().toLowerCase() ===
						values.soHieuVanBang.trim().toLowerCase() &&
					item.id !== editingDiploma?.id
			);
			if (duplicatedSoHieu) {
				message.error('Số hiệu văn bằng đã tồn tại');
				return;
			}

			const dynamicValues: Record<string, string | number> = {};
			truongDuLieus.forEach((field) => {
				const rawValue = values.duLieuMoRong?.[field.id];
				if (rawValue === undefined || rawValue === null || rawValue === '') {
					return;
				}
				if (field.kieuDuLieu === 'date') {
					dynamicValues[field.id] = rawValue.format('YYYY-MM-DD');
					return;
				}
				dynamicValues[field.id] = rawValue;
			});

			if (editingDiploma) {
				const updated = vanBangs.map((item) =>
					item.id === editingDiploma.id
						? {
								...item,
								quyetDinhId: values.quyetDinhId,
								soVanBangId: selected.soVanBangId,
								soHieuVanBang: values.soHieuVanBang.trim(),
								maSinhVien: values.maSinhVien.trim(),
								hoTen: values.hoTen.trim(),
								ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
								duLieuMoRong: dynamicValues,
						  }
						: item
				);
				persistVanBangs(updated);
				message.success('Cập nhật thông tin văn bằng thành công');
			} else {
				const created: VanBang = {
					id: uuidv4(),
					quyetDinhId: values.quyetDinhId,
					soVanBangId: selected.soVanBangId,
					soVaoSo: getNextSoVaoSo(selected.soVanBangId),
					soHieuVanBang: values.soHieuVanBang.trim(),
					maSinhVien: values.maSinhVien.trim(),
					hoTen: values.hoTen.trim(),
					ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
					duLieuMoRong: dynamicValues,
					createdAt: Date.now(),
				};
				persistVanBangs([...vanBangs, created]);
				message.success('Thêm văn bằng thành công');
			}

			setDiplomaModalVisible(false);
			setEditingDiploma(null);
			diplomaForm.resetFields();
		} catch (error) {
			message.error('Vui lòng nhập đầy đủ thông tin văn bằng');
		}
	};

	const handleDeleteDiploma = (id: string) => {
		persistVanBangs(vanBangs.filter((item) => item.id !== id));
		message.success('Xóa văn bằng thành công');
	};

	const openDiplomaDetail = (record: VanBang, countLookup = false) => {
		if (countLookup) {
			const updatedDecisions = quyetDinhs.map((item) =>
				item.id === record.quyetDinhId ? { ...item, lookupCount: item.lookupCount + 1 } : item
			);
			persistQuyetDinhs(updatedDecisions);
		}
		setViewingDiploma(record);
		setDetailModalVisible(true);
	};

	const handleSearch = async () => {
		const values = await searchForm.validateFields();
		const conditionCount = [
			values.soHieuVanBang,
			values.soVaoSo,
			values.maSinhVien,
			values.hoTen,
			values.ngaySinh,
		].filter(Boolean).length;

		if (conditionCount < 2) {
			message.error('Tra cứu yêu cầu nhập ít nhất 2 tham số');
			setSearchResults([]);
			return;
		}

		const filtered = vanBangs.filter((item) => {
			const matchedSoHieu = values.soHieuVanBang
				? item.soHieuVanBang.toLowerCase().includes(values.soHieuVanBang.toLowerCase().trim())
				: true;

			const matchedSoVaoSo = values.soVaoSo ? item.soVaoSo === values.soVaoSo : true;

			const matchedMsv = values.maSinhVien
				? item.maSinhVien.toLowerCase().includes(values.maSinhVien.toLowerCase().trim())
				: true;

			const matchedHoTen = values.hoTen
				? item.hoTen.toLowerCase().includes(values.hoTen.toLowerCase().trim())
				: true;

			const matchedNgaySinh = values.ngaySinh
				? item.ngaySinh === values.ngaySinh.format('YYYY-MM-DD')
				: true;

			return matchedSoHieu && matchedSoVaoSo && matchedMsv && matchedHoTen && matchedNgaySinh;
		});

		setSearchResults(filtered);
		message.success(`Tìm thấy ${filtered.length} kết quả`);
	};

	const totalLookup = useMemo(
		() => quyetDinhs.reduce((sum, item) => sum + item.lookupCount, 0),
		[quyetDinhs]
	);

	const bookColumns = [
		{ title: 'Năm', dataIndex: 'nam', key: 'nam', width: 110 },
		{ title: 'Mã sổ văn bằng', dataIndex: 'maSo', key: 'maSo' },
		{
			title: 'Số văn bằng đã cấp',
			key: 'count',
			render: (_: unknown, record: SoVanBang) =>
				vanBangs.filter((item) => item.soVanBangId === record.id).length,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: SoVanBang) => (
				<Space>
					<Button size="small" icon={<EditOutlined />} onClick={() => openEditBook(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa sổ văn bằng này?" onConfirm={() => handleDeleteBook(record.id)}>
						<Button size="small" danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const decisionColumns = [
		{ title: 'Số quyết định', dataIndex: 'soQuyetDinh', key: 'soQuyetDinh' },
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			key: 'ngayBanHanh',
			render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
		},
		{ title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu', ellipsis: true },
		{
			title: 'Sổ văn bằng',
			dataIndex: 'soVanBangId',
			key: 'soVanBangId',
			render: (id: string) => getSoVanBangName(id),
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'lookupCount',
			key: 'lookupCount',
			render: (value: number) => <Tag color="blue">{value}</Tag>,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: QuyetDinhTotNghiep) => (
				<Space>
					<Button size="small" icon={<EditOutlined />} onClick={() => openEditDecision(record)}>
						Sửa
					</Button>
					<Popconfirm
						title="Xóa quyết định này?"
						onConfirm={() => handleDeleteDecision(record.id)}
					>
						<Button size="small" danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const fieldColumns = [
		{ title: 'Tên hiển thị', dataIndex: 'label', key: 'label' },
		{ title: 'Khóa dữ liệu', dataIndex: 'key', key: 'key' },
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'kieuDuLieu',
			key: 'kieuDuLieu',
			render: (value: FieldDataType) => {
				if (value === 'string') {
					return <Tag color="green">String</Tag>;
				}
				if (value === 'number') {
					return <Tag color="gold">Number</Tag>;
				}
				return <Tag color="purple">Date</Tag>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: TruongDuLieu) => (
				<Space>
					<Button size="small" icon={<EditOutlined />} onClick={() => openEditField(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa trường này?" onConfirm={() => handleDeleteField(record.id)}>
						<Button size="small" danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const diplomaColumns = [
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', width: 120 },
		{ title: 'Số hiệu văn bằng', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
		{ title: 'Mã sinh viên', dataIndex: 'maSinhVien', key: 'maSinhVien', width: 130 },
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			key: 'ngaySinh',
			render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			key: 'quyetDinhId',
			render: (id: string) => getQuyetDinhName(id),
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: unknown, record: VanBang) => (
				<Space>
					<Button size="small" icon={<EyeOutlined />} onClick={() => openDiplomaDetail(record)}>
						Xem
					</Button>
					<Button size="small" icon={<EditOutlined />} onClick={() => openEditDiploma(record)}>
						Sửa
					</Button>
					<Popconfirm title="Xóa văn bằng này?" onConfirm={() => handleDeleteDiploma(record.id)}>
						<Button size="small" danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const searchColumns = [
		{ title: 'Số hiệu văn bằng', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', width: 110 },
		{ title: 'Mã sinh viên', dataIndex: 'maSinhVien', key: 'maSinhVien', width: 130 },
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			key: 'quyetDinhId',
			render: (id: string) => getQuyetDinhName(id),
		},
		{
			title: 'Chi tiết',
			key: 'action',
			render: (_: unknown, record: VanBang) => (
				<Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => openDiplomaDetail(record, true)}>
					Xem chi tiết
				</Button>
			),
		},
	];

	const renderDynamicValue = (field: TruongDuLieu, diploma: VanBang) => {
		const value = diploma.duLieuMoRong[field.id];
		if (value === undefined || value === null || value === '') {
			return '-';
		}
		if (field.kieuDuLieu === 'date') {
			return dayjs(String(value)).format('DD/MM/YYYY');
		}
		return String(value);
	};

	const downloadTextFile = (fileName: string, content: string, contentType: string) => {
		const blob = new Blob([content], { type: contentType });
		const url = window.URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = fileName;
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		window.URL.revokeObjectURL(url);
	};

	const handleExportJson = () => {
		const payload = {
			generatedAt: new Date().toISOString(),
			soVanBangs,
			quyetDinhs,
			truongDuLieus,
			vanBangs,
		};
		downloadTextFile(
			`du-lieu-van-bang-${dayjs().format('YYYYMMDD-HHmmss')}.json`,
			JSON.stringify(payload, null, 2),
			'application/json;charset=utf-8'
		);
		message.success('Đã xuất file dữ liệu');
	};

	const toCsvCell = (value: string | number) => {
		const stringValue = String(value);
		if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
			return `"${stringValue.replace(/"/g, '""')}"`;
		}
		return stringValue;
	};

	const handleExportCsv = () => {
		const staticHeaders = [
			'SoHieuVanBang',
			'SoVaoSo',
			'MaSinhVien',
			'HoTen',
			'NgaySinh',
			'SoQuyetDinh',
			'SoVanBang',
		];
		const dynamicHeaders = truongDuLieus.map((field) => field.key);
		const headers = [...staticHeaders, ...dynamicHeaders];

		const lines = [headers.join(',')];
		vanBangs.forEach((item) => {
			const quyetDinh = quyetDinhs.find((d) => d.id === item.quyetDinhId);
			const soVanBang = soVanBangs.find((s) => s.id === item.soVanBangId);

			const staticValues: Array<string | number> = [
				item.soHieuVanBang,
				item.soVaoSo,
				item.maSinhVien,
				item.hoTen,
				item.ngaySinh,
				quyetDinh?.soQuyetDinh || '',
				soVanBang?.maSo || '',
			];

			const dynamicValues: Array<string | number> = truongDuLieus.map(
				(field) => item.duLieuMoRong[field.id] || ''
			);

			lines.push([...staticValues, ...dynamicValues].map((cell) => toCsvCell(cell)).join(','));
		});

		downloadTextFile(
			`danh-sach-van-bang-${dayjs().format('YYYYMMDD-HHmmss')}.csv`,
			`\ufeff${lines.join('\n')}`,
			'text/csv;charset=utf-8'
		);
		message.success('Đã xuất file danh sách (mở bằng Excel)');
	};

	const handleGenerateDemoData = () => {
		if (vanBangs.length > 0 || quyetDinhs.length > 0 || soVanBangs.length > 0) {
			const shouldReplace = window.confirm(
				'Dữ liệu hiện tại sẽ bị thay thế bằng dữ liệu mẫu. Bạn có chắc chắn muốn tiếp tục?'
			);
			if (!shouldReplace) {
				return;
			}
		}

		const year = dayjs().year();
		const demoBooks: SoVanBang[] = [
			{ id: uuidv4(), nam: year, maSo: `SVB-${year}`, createdAt: Date.now() },
			{ id: uuidv4(), nam: year - 1, maSo: `SVB-${year - 1}`, createdAt: Date.now() },
		];

		const demoDecisions: QuyetDinhTotNghiep[] = [
			{
				id: uuidv4(),
				soQuyetDinh: `21/QD-DHTL-${year}`,
				ngayBanHanh: `${year}-03-15`,
				trichYeu: 'Công nhận tốt nghiệp đợt 1',
				soVanBangId: demoBooks[0].id,
				lookupCount: 0,
				createdAt: Date.now(),
			},
			{
				id: uuidv4(),
				soQuyetDinh: `22/QD-DHTL-${year}`,
				ngayBanHanh: `${year}-06-20`,
				trichYeu: 'Công nhận tốt nghiệp đợt 2',
				soVanBangId: demoBooks[0].id,
				lookupCount: 0,
				createdAt: Date.now(),
			},
			{
				id: uuidv4(),
				soQuyetDinh: `18/QD-DHTL-${year - 1}`,
				ngayBanHanh: `${year - 1}-11-02`,
				trichYeu: 'Công nhận tốt nghiệp bổ sung',
				soVanBangId: demoBooks[1].id,
				lookupCount: 0,
				createdAt: Date.now(),
			},
		];

		const demoFields: TruongDuLieu[] = [
			...DEFAULT_TRUONG_DU_LIEU,
			{ id: uuidv4(), key: 'dan_toc', label: 'Dân tộc', kieuDuLieu: 'string', createdAt: Date.now() },
			{ id: uuidv4(), key: 'noi_sinh', label: 'Nơi sinh', kieuDuLieu: 'string', createdAt: Date.now() },
			{ id: uuidv4(), key: 'ngay_nhap_hoc', label: 'Ngày nhập học', kieuDuLieu: 'date', createdAt: Date.now() },
		];

		const byKey = (key: string) => demoFields.find((item) => item.key === key)?.id || '';

		const demoDiplomas: VanBang[] = [
			{
				id: uuidv4(),
				soVanBangId: demoBooks[0].id,
				quyetDinhId: demoDecisions[0].id,
				soVaoSo: 1,
				soHieuVanBang: `VB-${year}-0001`,
				maSinhVien: 'A10001',
				hoTen: 'Nguyen Van An',
				ngaySinh: `${year - 22}-01-10`,
				duLieuMoRong: {
					[byKey('diem_trung_binh')]: 3.45,
					[byKey('xep_hang')]: 'Khá',
					[byKey('he_dao_tao')]: 'Chính quy',
					[byKey('dan_toc')]: 'Kinh',
					[byKey('noi_sinh')]: 'Hà Nội',
					[byKey('ngay_nhap_hoc')]: `${year - 26}-09-05`,
				},
				createdAt: Date.now(),
			},
			{
				id: uuidv4(),
				soVanBangId: demoBooks[0].id,
				quyetDinhId: demoDecisions[1].id,
				soVaoSo: 2,
				soHieuVanBang: `VB-${year}-0002`,
				maSinhVien: 'A10002',
				hoTen: 'Tran Thi Bich',
				ngaySinh: `${year - 22}-03-21`,
				duLieuMoRong: {
					[byKey('diem_trung_binh')]: 3.82,
					[byKey('xep_hang')]: 'Giỏi',
					[byKey('he_dao_tao')]: 'Chính quy',
					[byKey('dan_toc')]: 'Kinh',
					[byKey('noi_sinh')]: 'Đà Nẵng',
					[byKey('ngay_nhap_hoc')]: `${year - 26}-09-05`,
				},
				createdAt: Date.now(),
			},
			{
				id: uuidv4(),
				soVanBangId: demoBooks[1].id,
				quyetDinhId: demoDecisions[2].id,
				soVaoSo: 1,
				soHieuVanBang: `VB-${year - 1}-0042`,
				maSinhVien: 'B20042',
				hoTen: 'Le Quoc Cuong',
				ngaySinh: `${year - 23}-12-02`,
				duLieuMoRong: {
					[byKey('diem_trung_binh')]: 2.95,
					[byKey('xep_hang')]: 'Trung bình khá',
					[byKey('he_dao_tao')]: 'Vừa học vừa làm',
					[byKey('dan_toc')]: 'Tày',
					[byKey('noi_sinh')]: 'Thái Nguyên',
					[byKey('ngay_nhap_hoc')]: `${year - 27}-09-05`,
				},
				createdAt: Date.now(),
			},
		];

		persistSoVanBangs(demoBooks);
		persistQuyetDinhs(demoDecisions);
		persistTruongDuLieus(demoFields);
		persistVanBangs(demoDiplomas);
		setSearchResults([]);
		message.success('Đã tạo dữ liệu mẫu thành công');
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Quản lý văn bằng tốt nghiệp</h1>
			<p style={{ color: '#666', marginBottom: 20 }}>
				Quản lý sổ văn bằng, quyết định tốt nghiệp, cấu hình biểu mẫu phụ lục, thông tin văn bằng và tra cứu.
			</p>
			<Space style={{ marginBottom: 16 }}>
				<Button onClick={handleGenerateDemoData}>Tạo dữ liệu mẫu</Button>
				<Button icon={<DownloadOutlined />} onClick={handleExportJson} disabled={vanBangs.length === 0}>
					Xuất dữ liệu
				</Button>
				<Button icon={<DownloadOutlined />} onClick={handleExportCsv} disabled={vanBangs.length === 0}>
					Xuất danh sách Excel
				</Button>
			</Space>

			<Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title="Sổ văn bằng" value={soVanBangs.length} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title="Quyết định tốt nghiệp" value={quyetDinhs.length} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title="Văn bằng đã cấp" value={vanBangs.length} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title="Tổng lượt tra cứu" value={totalLookup} />
					</Card>
				</Col>
			</Row>

			<Tabs>
				<Tabs.TabPane tab="Sổ văn bằng" key="1">
					<Button type="primary" icon={<PlusOutlined />} onClick={openCreateBook} style={{ marginBottom: 16 }}>
						Thêm sổ văn bằng
					</Button>
					<Table dataSource={soVanBangs} columns={bookColumns} rowKey="id" />
				</Tabs.TabPane>

				<Tabs.TabPane tab="Quyết định tốt nghiệp" key="2">
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={openCreateDecision}
						style={{ marginBottom: 16 }}
						disabled={soVanBangs.length === 0}
					>
						Thêm quyết định
					</Button>
					{soVanBangs.length === 0 && (
						<p style={{ color: '#888' }}>Bạn cần tạo ít nhất 1 sổ văn bằng trước khi tạo quyết định.</p>
					)}
					<Table dataSource={quyetDinhs} columns={decisionColumns} rowKey="id" />
				</Tabs.TabPane>

				<Tabs.TabPane tab="Cấu hình biểu mẫu" key="3">
					<Button type="primary" icon={<PlusOutlined />} onClick={openCreateField} style={{ marginBottom: 16 }}>
						Thêm trường dữ liệu
					</Button>
					<Table dataSource={truongDuLieus} columns={fieldColumns} rowKey="id" pagination={false} />
				</Tabs.TabPane>

				<Tabs.TabPane tab="Thông tin văn bằng" key="4">
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={openCreateDiploma}
						style={{ marginBottom: 16 }}
						disabled={quyetDinhs.length === 0}
					>
						Thêm văn bằng
					</Button>
					{vanBangs.length === 0 ? (
						<Empty description="Chưa có dữ liệu văn bằng" />
					) : (
						<Table dataSource={vanBangs} columns={diplomaColumns} rowKey="id" scroll={{ x: 1200 }} />
					)}
				</Tabs.TabPane>

				<Tabs.TabPane tab="Tra cứu văn bằng" key="5">
					<Card style={{ marginBottom: 16 }}>
						<Form form={searchForm} layout="vertical">
							<Row gutter={[16, 8]}>
								<Col xs={24} md={8}>
									<Form.Item label="Số hiệu văn bằng" name="soHieuVanBang">
										<Input placeholder="Nhập số hiệu văn bằng" />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item label="Số vào sổ" name="soVaoSo">
										<InputNumber style={{ width: '100%' }} min={1} />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item label="Mã sinh viên" name="maSinhVien">
										<Input placeholder="Nhập mã sinh viên" />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item label="Họ tên" name="hoTen">
										<Input placeholder="Nhập họ tên" />
									</Form.Item>
								</Col>
								<Col xs={24} md={8}>
									<Form.Item label="Ngày sinh" name="ngaySinh">
										<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
									</Form.Item>
								</Col>
								<Col xs={24} md={8} style={{ display: 'flex', alignItems: 'end' }}>
									<Space>
										<Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
											Tra cứu
										</Button>
										<Button
											onClick={() => {
												searchForm.resetFields();
												setSearchResults([]);
											}}
										>
											Xóa bộ lọc
										</Button>
									</Space>
								</Col>
							</Row>
						</Form>
						<p style={{ marginTop: 8, color: '#888' }}>
							Yêu cầu nhập ít nhất 2 tham số: số hiệu văn bằng, số vào sổ, MSV, họ tên hoặc ngày sinh.
						</p>
					</Card>

					{searchResults.length === 0 ? (
						<Empty description="Chưa có kết quả tra cứu" />
					) : (
						<Table dataSource={searchResults} columns={searchColumns} rowKey="id" />
					)}
				</Tabs.TabPane>
			</Tabs>

			<Modal
				title={editingBook ? 'Sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
				visible={bookModalVisible}
				onCancel={() => {
					setBookModalVisible(false);
					setEditingBook(null);
					bookForm.resetFields();
				}}
				onOk={handleSaveBook}
			>
				<Form form={bookForm} layout="vertical">
					<Form.Item
						name="nam"
						label="Năm sổ"
						rules={[{ required: true, message: 'Vui lòng nhập năm sổ' }]}
					>
						<InputNumber min={1990} max={2200} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name="maSo"
						label="Mã sổ văn bằng"
						rules={[{ required: true, message: 'Vui lòng nhập mã sổ văn bằng' }]}
					>
						<Input placeholder="Ví dụ: SVB-2026" />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingDecision ? 'Sửa quyết định tốt nghiệp' : 'Thêm quyết định tốt nghiệp'}
				visible={decisionModalVisible}
				onCancel={() => {
					setDecisionModalVisible(false);
					setEditingDecision(null);
					decisionForm.resetFields();
				}}
				onOk={handleSaveDecision}
			>
				<Form form={decisionForm} layout="vertical">
					<Form.Item
						name="soQuyetDinh"
						label="Số quyết định"
						rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
					>
						<Input placeholder="Ví dụ: 21/QĐ-ĐHTL" />
					</Form.Item>
					<Form.Item
						name="ngayBanHanh"
						label="Ngày ban hành"
						rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
					>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Form.Item
						name="trichYeu"
						label="Trích yếu"
						rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
					>
						<Input.TextArea rows={3} placeholder="Nội dung trích yếu quyết định" />
					</Form.Item>
					<Form.Item
						name="soVanBangId"
						label="Thuộc sổ văn bằng"
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
					>
						<Select placeholder="Chọn sổ văn bằng">
							{soVanBangs.map((item) => (
								<Select.Option key={item.id} value={item.id}>
									{getSoVanBangName(item.id)}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingField ? 'Sửa trường dữ liệu' : 'Thêm trường dữ liệu'}
				visible={fieldModalVisible}
				onCancel={() => {
					setFieldModalVisible(false);
					setEditingField(null);
					fieldForm.resetFields();
				}}
				onOk={handleSaveField}
			>
				<Form form={fieldForm} layout="vertical">
					<Form.Item
						name="label"
						label="Tên trường"
						rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
					>
						<Input placeholder="Ví dụ: Dân tộc" />
					</Form.Item>
					<Form.Item
						name="key"
						label="Khóa dữ liệu"
						rules={[
							{ required: true, message: 'Vui lòng nhập khóa dữ liệu' },
							{
								pattern: /^[a-z0-9_]+$/,
								message: 'Chỉ dùng chữ thường, số và dấu gạch dưới',
							},
						]}
					>
						<Input placeholder="Vi du: dan_toc" />
					</Form.Item>
					<Form.Item
						name="kieuDuLieu"
						label="Kiểu dữ liệu"
						rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
					>
						<Select placeholder="Chọn kiểu dữ liệu">
							<Select.Option value="string">String</Select.Option>
							<Select.Option value="number">Number</Select.Option>
							<Select.Option value="date">Date</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingDiploma ? 'Sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
				visible={diplomaModalVisible}
				width={800}
				onCancel={() => {
					setDiplomaModalVisible(false);
					setEditingDiploma(null);
					diplomaForm.resetFields();
				}}
				onOk={handleSaveDiploma}
			>
				<Form form={diplomaForm} layout="vertical">
					<Row gutter={[12, 0]}>
						<Col xs={24} md={12}>
							<Form.Item
								name="quyetDinhId"
								label="Quyết định tốt nghiệp"
								rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp' }]}
							>
								<Select placeholder="Chọn quyết định tốt nghiệp">
									{quyetDinhs.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.soQuyetDinh} - {item.trichYeu}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label="Số vào sổ (tự động)">
								<Input value={previewSoVaoSo} disabled />
							</Form.Item>
						</Col>

						<Col xs={24} md={12}>
							<Form.Item
								name="soHieuVanBang"
								label="Số hiệu văn bằng"
								rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
							>
								<Input placeholder="Ví dụ: VB-2026-0001" />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name="maSinhVien"
								label="Mã sinh viên"
								rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name="hoTen"
								label="Họ tên"
								rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name="ngaySinh"
								label="Ngày sinh"
								rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
							>
								<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
							</Form.Item>
						</Col>
					</Row>

					<Divider orientation="left">Trường dữ liệu cấu hình thêm</Divider>

					<Row gutter={[12, 0]}>
						{truongDuLieus.map((field) => (
							<Col xs={24} md={12} key={field.id}>
								<Form.Item name={['duLieuMoRong', field.id]} label={field.label}>
									{field.kieuDuLieu === 'string' && <Input placeholder={`Nhập ${field.label}`} />}
									{field.kieuDuLieu === 'number' && (
										<InputNumber style={{ width: '100%' }} placeholder={`Nhập ${field.label}`} />
									)}
									{field.kieuDuLieu === 'date' && (
										<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
									)}
								</Form.Item>
							</Col>
						))}
					</Row>
				</Form>
			</Modal>

			<Modal
				title="Chi tiết văn bằng"
				visible={detailModalVisible}
				width={850}
				footer={<Button onClick={() => setDetailModalVisible(false)}>Đóng</Button>}
				onCancel={() => setDetailModalVisible(false)}
			>
				{viewingDiploma ? (
					<>
						<Descriptions bordered column={2} size="small">
							<Descriptions.Item label="Số vào sổ">{viewingDiploma.soVaoSo}</Descriptions.Item>
							<Descriptions.Item label="Số hiệu văn bằng">
								{viewingDiploma.soHieuVanBang}
							</Descriptions.Item>
							<Descriptions.Item label="Mã sinh viên">
								{viewingDiploma.maSinhVien}
							</Descriptions.Item>
							<Descriptions.Item label="Họ tên">{viewingDiploma.hoTen}</Descriptions.Item>
							<Descriptions.Item label="Ngày sinh">
								{dayjs(viewingDiploma.ngaySinh).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label="Sổ văn bằng">
								{getSoVanBangName(viewingDiploma.soVanBangId)}
							</Descriptions.Item>
							<Descriptions.Item label="Quyết định tốt nghiệp" span={2}>
								{getQuyetDinhName(viewingDiploma.quyetDinhId)}
							</Descriptions.Item>
						</Descriptions>

						<Divider orientation="left">Thông tin mở rộng</Divider>
						<Descriptions bordered column={2} size="small">
							{truongDuLieus.map((field) => (
								<Descriptions.Item key={field.id} label={field.label}>
									{renderDynamicValue(field, viewingDiploma)}
								</Descriptions.Item>
							))}
						</Descriptions>
					</>
				) : (
					<Empty description="Không có dữ liệu chi tiết" />
				)}
			</Modal>
		</div>
	);
};

export default QuanLyHocTapPage;
