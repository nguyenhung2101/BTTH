import ColumnChart from '@/components/Chart/ColumnChart';
import TinyEditor from '@/components/TinyEditor';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	DatePicker,
	Descriptions,
	Empty,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tabs,
	Tag,
	Typography,
	message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;

type ClubStatus = 'active' | 'inactive';
type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
type Gender = 'Nam' | 'Nữ' | 'Khác';
type HistoryAction =
	| 'CREATE'
	| 'UPDATE'
	| 'DELETE'
	| 'APPROVE'
	| 'REJECT'
	| 'TRANSFER_CLUB';

interface Club {
	id: string;
	avatarUrl: string;
	name: string;
	foundedDate: string;
	descriptionHtml: string;
	president: string;
	status: ClubStatus;
	createdAt: number;
}

interface RegistrationApplication {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	gender: Gender;
	address: string;
	talent: string;
	clubId: string;
	reason: string;
	status: ApplicationStatus;
	note?: string;
	rejectionReason?: string;
	createdAt: number;
	updatedAt: number;
}

interface ClubMember {
	id: string;
	applicationId: string;
	fullName: string;
	email: string;
	phone: string;
	gender: Gender;
	address: string;
	talent: string;
	clubId: string;
	joinedAt: number;
}

interface ActionHistory {
	id: string;
	action: HistoryAction;
	target: 'club' | 'application' | 'member';
	targetIds: string[];
	detail: string;
	operator: string;
	createdAt: number;
}

const STORAGE_KEYS = {
	clubs: 'th05_clubs',
	applications: 'th05_applications',
	members: 'th05_members',
	histories: 'th05_histories',
};

const ADMIN_NAME = 'Admin';

const QuanLyHocTapPage: React.FC = () => {
	const [clubs, setClubs] = useState<Club[]>([]);
	const [applications, setApplications] = useState<RegistrationApplication[]>([]);
	const [members, setMembers] = useState<ClubMember[]>([]);
	const [histories, setHistories] = useState<ActionHistory[]>([]);

	const [activeTab, setActiveTab] = useState('clubs');
	const [memberClubFilter, setMemberClubFilter] = useState<string | undefined>();

	const [clubKeyword, setClubKeyword] = useState('');
	const [applicationKeyword, setApplicationKeyword] = useState('');
	const [memberKeyword, setMemberKeyword] = useState('');

	const [selectedApplicationRowKeys, setSelectedApplicationRowKeys] = useState<string[]>([]);
	const [selectedMemberRowKeys, setSelectedMemberRowKeys] = useState<string[]>([]);

	const [clubModalVisible, setClubModalVisible] = useState(false);
	const [applicationModalVisible, setApplicationModalVisible] = useState(false);
	const [applicationDetailVisible, setApplicationDetailVisible] = useState(false);
	const [rejectModalVisible, setRejectModalVisible] = useState(false);
	const [historyModalVisible, setHistoryModalVisible] = useState(false);
	const [transferModalVisible, setTransferModalVisible] = useState(false);

	const [editingClub, setEditingClub] = useState<Club | null>(null);
	const [editingApplication, setEditingApplication] = useState<RegistrationApplication | null>(null);
	const [viewingApplication, setViewingApplication] =
		useState<RegistrationApplication | null>(null);
	const [pendingRejectIds, setPendingRejectIds] = useState<string[]>([]);

	const [clubForm] = Form.useForm();
	const [applicationForm] = Form.useForm();
	const [rejectForm] = Form.useForm();
	const [transferForm] = Form.useForm();

	const persistClubs = (data: Club[]) => {
		setClubs(data);
		localStorage.setItem(STORAGE_KEYS.clubs, JSON.stringify(data));
	};

	const persistApplications = (data: RegistrationApplication[]) => {
		setApplications(data);
		localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(data));
	};

	const persistMembers = (data: ClubMember[]) => {
		setMembers(data);
		localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(data));
	};

	const persistHistories = (data: ActionHistory[]) => {
		setHistories(data);
		localStorage.setItem(STORAGE_KEYS.histories, JSON.stringify(data));
	};

	const pushHistory = (
		action: HistoryAction,
		target: 'club' | 'application' | 'member',
		targetIds: string[],
		detail: string
	) => {
		const next: ActionHistory = {
			id: uuidv4(),
			action,
			target,
			targetIds,
			detail,
			operator: ADMIN_NAME,
			createdAt: Date.now(),
		};
		persistHistories([next, ...histories]);
	};

	useEffect(() => {
		const parsedClubs: Club[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.clubs) || '[]');
		const parsedApplications: RegistrationApplication[] = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.applications) || '[]'
		);
		const parsedMembers: ClubMember[] = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.members) || '[]'
		);
		const parsedHistories: ActionHistory[] = JSON.parse(
			localStorage.getItem(STORAGE_KEYS.histories) || '[]'
		);

		setClubs(parsedClubs);
		setApplications(parsedApplications);
		setMembers(parsedMembers);
		setHistories(parsedHistories);
	}, []);

	const getClubName = (clubId: string) => clubs.find((club) => club.id === clubId)?.name || '-';

	const clubOptions = clubs.map((club) => ({ label: club.name, value: club.id }));

	const filteredClubs = useMemo(() => {
		const normalizedKeyword = clubKeyword.trim().toLowerCase();
		if (!normalizedKeyword) {
			return clubs;
		}
		return clubs.filter((club) => {
			return (
				club.name.toLowerCase().includes(normalizedKeyword) ||
				club.president.toLowerCase().includes(normalizedKeyword)
			);
		});
	}, [clubs, clubKeyword]);

	const filteredApplications = useMemo(() => {
		const normalizedKeyword = applicationKeyword.trim().toLowerCase();
		if (!normalizedKeyword) {
			return applications;
		}
		return applications.filter((item) => {
			return (
				item.fullName.toLowerCase().includes(normalizedKeyword) ||
				item.email.toLowerCase().includes(normalizedKeyword) ||
				item.phone.toLowerCase().includes(normalizedKeyword)
			);
		});
	}, [applications, applicationKeyword]);

	const filteredMembers = useMemo(() => {
		const keyword = memberKeyword.trim().toLowerCase();
		return members.filter((item) => {
			const matchedKeyword =
				!keyword ||
				item.fullName.toLowerCase().includes(keyword) ||
				item.email.toLowerCase().includes(keyword) ||
				item.phone.toLowerCase().includes(keyword);
			const matchedClub = !memberClubFilter || item.clubId === memberClubFilter;
			return matchedKeyword && matchedClub;
		});
	}, [memberKeyword, memberClubFilter, members]);

	const stats = useMemo(() => {
		const pending = applications.filter((item) => item.status === 'Pending').length;
		const approved = applications.filter((item) => item.status === 'Approved').length;
		const rejected = applications.filter((item) => item.status === 'Rejected').length;
		return {
			clubCount: clubs.length,
			pending,
			approved,
			rejected,
		};
	}, [applications, clubs.length]);

	const chartData = useMemo(() => {
		const xAxis = clubs.map((club) => club.name);
		const pendingData = clubs.map(
			(club) =>
				applications.filter((item) => item.clubId === club.id && item.status === 'Pending').length
		);
		const approvedData = clubs.map(
			(club) =>
				applications.filter((item) => item.clubId === club.id && item.status === 'Approved').length
		);
		const rejectedData = clubs.map(
			(club) =>
				applications.filter((item) => item.clubId === club.id && item.status === 'Rejected').length
		);
		return {
			xAxis,
			yAxis: [pendingData, approvedData, rejectedData],
		};
	}, [applications, clubs]);

	const openCreateClub = () => {
		setEditingClub(null);
		clubForm.resetFields();
		clubForm.setFieldsValue({ status: 'active' });
		setClubModalVisible(true);
	};

	const openEditClub = (record: Club) => {
		setEditingClub(record);
		clubForm.setFieldsValue({
			...record,
			foundedDate: dayjs(record.foundedDate),
		});
		setClubModalVisible(true);
	};

	const handleSaveClub = async () => {
		try {
			const values = await clubForm.validateFields();
			const duplicatedName = clubs.some(
				(item) =>
					item.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
					item.id !== editingClub?.id
			);
			if (duplicatedName) {
				message.error('Tên câu lạc bộ đã tồn tại');
				return;
			}

			if (editingClub) {
				const updated = clubs.map((item) =>
					item.id === editingClub.id
						? {
								...item,
								avatarUrl: values.avatarUrl || '',
								name: values.name.trim(),
								foundedDate: values.foundedDate.format('YYYY-MM-DD'),
								descriptionHtml: values.descriptionHtml || '',
								president: values.president.trim(),
								status: values.status,
						  }
						: item
				);
				persistClubs(updated);
				pushHistory('UPDATE', 'club', [editingClub.id], `Cập nhật CLB ${values.name.trim()}`);
				message.success('Cập nhật câu lạc bộ thành công');
			} else {
				const created: Club = {
					id: uuidv4(),
					avatarUrl: values.avatarUrl || '',
					name: values.name.trim(),
					foundedDate: values.foundedDate.format('YYYY-MM-DD'),
					descriptionHtml: values.descriptionHtml || '',
					president: values.president.trim(),
					status: values.status,
					createdAt: Date.now(),
				};
				persistClubs([...clubs, created]);
				pushHistory('CREATE', 'club', [created.id], `Tạo CLB ${created.name}`);
				message.success('Tạo câu lạc bộ thành công');
			}

			setEditingClub(null);
			setClubModalVisible(false);
			clubForm.resetFields();
		} catch (_error) {
			message.error('Vui lòng nhập đầy đủ thông tin câu lạc bộ');
		}
	};

	const handleDeleteClub = (clubId: string) => {
		const usedByApplications = applications.some((item) => item.clubId === clubId);
		const usedByMembers = members.some((item) => item.clubId === clubId);
		if (usedByApplications || usedByMembers) {
			message.error('Không thể xóa CLB vì đang có đơn đăng ký hoặc thành viên liên quan');
			return;
		}
		const deletingName = getClubName(clubId);
		persistClubs(clubs.filter((item) => item.id !== clubId));
		pushHistory('DELETE', 'club', [clubId], `Xóa CLB ${deletingName}`);
		message.success('Xóa câu lạc bộ thành công');
	};

	const openCreateApplication = () => {
		if (clubs.length === 0) {
			message.warning('Cần tạo câu lạc bộ trước khi thêm đơn đăng ký');
			return;
		}
		setEditingApplication(null);
		applicationForm.resetFields();
		applicationForm.setFieldsValue({ gender: 'Nam' });
		setApplicationModalVisible(true);
	};

	const openEditApplication = (record: RegistrationApplication) => {
		setEditingApplication(record);
		applicationForm.setFieldsValue({ ...record });
		setApplicationModalVisible(true);
	};

	const openApplicationDetail = (record: RegistrationApplication) => {
		setViewingApplication(record);
		setApplicationDetailVisible(true);
	};

	const syncMemberFromApplication = (
		nextApplication: RegistrationApplication,
		existingMembers: ClubMember[]
	) => {
		if (nextApplication.status !== 'Approved') {
			return existingMembers.filter((item) => item.applicationId !== nextApplication.id);
		}

		const existed = existingMembers.find((item) => item.applicationId === nextApplication.id);
		if (existed) {
			return existingMembers.map((item) =>
				item.applicationId === nextApplication.id
					? {
							...item,
							fullName: nextApplication.fullName,
							email: nextApplication.email,
							phone: nextApplication.phone,
							gender: nextApplication.gender,
							address: nextApplication.address,
							talent: nextApplication.talent,
							clubId: nextApplication.clubId,
						  }
					: item
			);
		}

		return [
			...existingMembers,
			{
				id: uuidv4(),
				applicationId: nextApplication.id,
				fullName: nextApplication.fullName,
				email: nextApplication.email,
				phone: nextApplication.phone,
				gender: nextApplication.gender,
				address: nextApplication.address,
				talent: nextApplication.talent,
				clubId: nextApplication.clubId,
				joinedAt: Date.now(),
			},
		];
	};

	const handleSaveApplication = async () => {
		try {
			const values = await applicationForm.validateFields();
			if (editingApplication) {
				const nextApp: RegistrationApplication = {
					...editingApplication,
					fullName: values.fullName.trim(),
					email: values.email.trim(),
					phone: values.phone.trim(),
					gender: values.gender,
					address: values.address.trim(),
					talent: values.talent.trim(),
					clubId: values.clubId,
					reason: values.reason.trim(),
					note: values.note?.trim(),
					updatedAt: Date.now(),
				};

				const nextApplications = applications.map((item) =>
					item.id === editingApplication.id ? nextApp : item
				);
				persistApplications(nextApplications);
				const nextMembers = syncMemberFromApplication(nextApp, members);
				persistMembers(nextMembers);
				pushHistory('UPDATE', 'application', [editingApplication.id], `Cập nhật đơn ${nextApp.fullName}`);
				message.success('Cập nhật đơn đăng ký thành công');
			} else {
				const created: RegistrationApplication = {
					id: uuidv4(),
					fullName: values.fullName.trim(),
					email: values.email.trim(),
					phone: values.phone.trim(),
					gender: values.gender,
					address: values.address.trim(),
					talent: values.talent.trim(),
					clubId: values.clubId,
					reason: values.reason.trim(),
					status: 'Pending',
					note: values.note?.trim(),
					createdAt: Date.now(),
					updatedAt: Date.now(),
				};
				persistApplications([...applications, created]);
				pushHistory('CREATE', 'application', [created.id], `Tạo đơn đăng ký ${created.fullName}`);
				message.success('Tạo đơn đăng ký thành công');
			}

			setEditingApplication(null);
			setApplicationModalVisible(false);
			applicationForm.resetFields();
		} catch (_error) {
			message.error('Vui lòng nhập đầy đủ thông tin đơn đăng ký');
		}
	};

	const handleDeleteApplication = (applicationId: string) => {
		const app = applications.find((item) => item.id === applicationId);
		const nextApps = applications.filter((item) => item.id !== applicationId);
		const nextMembers = members.filter((item) => item.applicationId !== applicationId);
		persistApplications(nextApps);
		persistMembers(nextMembers);
		pushHistory('DELETE', 'application', [applicationId], `Xóa đơn đăng ký ${app?.fullName || ''}`);
		message.success('Xóa đơn đăng ký thành công');
	};

	const applyApproval = (ids: string[]) => {
		if (ids.length === 0) {
			return;
		}
		const nextApplications = applications.map((item) => {
			if (!ids.includes(item.id)) {
				return item;
			}
			return {
				...item,
				status: 'Approved' as ApplicationStatus,
				rejectionReason: undefined,
				updatedAt: Date.now(),
			};
		});

		const nextMembers = nextApplications.reduce((acc, app) => {
			return syncMemberFromApplication(app, acc);
		}, members);

		persistApplications(nextApplications);
		persistMembers(nextMembers);
		setSelectedApplicationRowKeys([]);
		pushHistory('APPROVE', 'application', ids, `${ADMIN_NAME} đã duyệt ${ids.length} đơn đăng ký`);
		message.success(`Đã duyệt ${ids.length} đơn đăng ký`);
	};

	const openRejectModal = (ids: string[]) => {
		if (ids.length === 0) {
			return;
		}
		setPendingRejectIds(ids);
		rejectForm.resetFields();
		setRejectModalVisible(true);
	};

	const confirmRejectApplications = async () => {
		try {
			const values = await rejectForm.validateFields();
			const reason = values.reason.trim();
			const nextApplications = applications.map((item) => {
				if (!pendingRejectIds.includes(item.id)) {
					return item;
				}
				return {
					...item,
					status: 'Rejected' as ApplicationStatus,
					rejectionReason: reason,
					updatedAt: Date.now(),
				};
			});
			persistApplications(nextApplications);
			persistMembers(members.filter((item) => !pendingRejectIds.includes(item.applicationId)));
			pushHistory(
				'REJECT',
				'application',
				pendingRejectIds,
				`${ADMIN_NAME} đã từ chối ${pendingRejectIds.length} đơn. Lý do: ${reason}`
			);
			setSelectedApplicationRowKeys([]);
			setPendingRejectIds([]);
			setRejectModalVisible(false);
			rejectForm.resetFields();
			message.success(`Đã từ chối ${pendingRejectIds.length} đơn đăng ký`);
		} catch (_error) {
			message.error('Vui lòng nhập lý do từ chối');
		}
	};

	const openTransferModal = () => {
		if (selectedMemberRowKeys.length === 0) {
			return;
		}
		transferForm.resetFields();
		setTransferModalVisible(true);
	};

	const handleTransferMembers = async () => {
		try {
			const values = await transferForm.validateFields();
			const nextMembers = members.map((item) =>
				selectedMemberRowKeys.includes(item.id) ? { ...item, clubId: values.targetClubId } : item
			);
			persistMembers(nextMembers);
			pushHistory(
				'TRANSFER_CLUB',
				'member',
				selectedMemberRowKeys,
				`Chuyển ${selectedMemberRowKeys.length} thành viên sang CLB ${getClubName(values.targetClubId)}`
			);
			setTransferModalVisible(false);
			setSelectedMemberRowKeys([]);
			transferForm.resetFields();
			message.success(`Đã chuyển ${selectedMemberRowKeys.length} thành viên`);
		} catch (_error) {
			message.error('Vui lòng chọn CLB muốn chuyển đến');
		}
	};

	const openClubMembers = (clubId: string) => {
		setMemberClubFilter(clubId);
		setActiveTab('members');
	};

	const clubColumns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'avatarUrl',
			key: 'avatarUrl',
			width: 110,
			render: (value: string, record: Club) => (
				<Avatar
					src={value || undefined}
					size={56}
					shape='square'
					style={{ backgroundColor: '#1677ff' }}
				>
					{record.name.charAt(0).toUpperCase()}
				</Avatar>
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'foundedDate',
			key: 'foundedDate',
			render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
			sorter: (a: Club, b: Club) => dayjs(a.foundedDate).valueOf() - dayjs(b.foundedDate).valueOf(),
		},
		{
			title: 'Mô tả',
			dataIndex: 'descriptionHtml',
			key: 'descriptionHtml',
			render: (value: string) => (
				<div style={{ maxWidth: 320 }} dangerouslySetInnerHTML={{ __html: value || '<i>Trống</i>' }} />
			),
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'president',
			key: 'president',
			sorter: (a: Club, b: Club) => a.president.localeCompare(b.president),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (value: ClubStatus) =>
				value === 'active' ? <Tag color='green'>Có</Tag> : <Tag color='default'>Không</Tag>,
			filters: [
				{ text: 'Có', value: 'active' },
				{ text: 'Không', value: 'inactive' },
			],
			onFilter: (value: string | number | boolean, record: Club) => record.status === value,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 320,
			render: (_: unknown, record: Club) => (
				<Space>
					<Button size='small' icon={<EditOutlined />} onClick={() => openEditClub(record)}>
						Chỉnh sửa
					</Button>
					<Popconfirm title='Xóa câu lạc bộ này?' onConfirm={() => handleDeleteClub(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
					<Button
						size='small'
						icon={<TeamOutlined />}
						onClick={() => openClubMembers(record.id)}
					>
						Thành viên
					</Button>
				</Space>
			),
		},
	];

	const applicationColumns = [
		{ title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', sorter: (a: RegistrationApplication, b: RegistrationApplication) => a.fullName.localeCompare(b.fullName) },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 100 },
		{ title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
		{ title: 'Sở trường', dataIndex: 'talent', key: 'talent', ellipsis: true },
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			key: 'clubId',
			render: (value: string) => getClubName(value),
		},
		{ title: 'Lý do đăng ký', dataIndex: 'reason', key: 'reason', ellipsis: true },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 130,
			render: (value: ApplicationStatus) => {
				if (value === 'Approved') {
					return <Tag color='green'>Approved</Tag>;
				}
				if (value === 'Rejected') {
					return <Tag color='red'>Rejected</Tag>;
				}
				return <Tag color='gold'>Pending</Tag>;
			},
			filters: [
				{ text: 'Pending', value: 'Pending' },
				{ text: 'Approved', value: 'Approved' },
				{ text: 'Rejected', value: 'Rejected' },
			],
			onFilter: (value: string | number | boolean, record: RegistrationApplication) =>
				record.status === value,
		},
		{ title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
		{
			title: 'Thao tác',
			key: 'action',
			width: 360,
			render: (_: unknown, record: RegistrationApplication) => (
				<Space wrap>
					<Button size='small' icon={<EyeOutlined />} onClick={() => openApplicationDetail(record)}>
						Chi tiết
					</Button>
					<Button size='small' icon={<EditOutlined />} onClick={() => openEditApplication(record)}>
						Chỉnh sửa
					</Button>
					<Popconfirm title='Xóa đơn đăng ký này?' onConfirm={() => handleDeleteApplication(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
					<Button
						size='small'
						type='primary'
						icon={<CheckCircleOutlined />}
						onClick={() => applyApproval([record.id])}
						disabled={record.status === 'Approved'}
					>
						Duyệt
					</Button>
					<Button
						size='small'
						danger
						icon={<CloseCircleOutlined />}
						onClick={() => openRejectModal([record.id])}
					>
						Từ chối
					</Button>
				</Space>
			),
		},
	];

	const memberColumns = [
		{ title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', sorter: (a: ClubMember, b: ClubMember) => a.fullName.localeCompare(b.fullName) },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'phone', key: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 100 },
		{ title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
		{ title: 'Sở trường', dataIndex: 'talent', key: 'talent', ellipsis: true },
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			key: 'clubId',
			render: (value: string) => getClubName(value),
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'joinedAt',
			key: 'joinedAt',
			render: (value: number) => dayjs(value).format('HH:mm DD/MM/YYYY'),
			sorter: (a: ClubMember, b: ClubMember) => a.joinedAt - b.joinedAt,
		},
	];

	const historyColumns = [
		{
			title: 'Thời gian',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (value: number) => dayjs(value).format('HH:mm DD/MM/YYYY'),
			sorter: (a: ActionHistory, b: ActionHistory) => b.createdAt - a.createdAt,
		},
		{
			title: 'Hành động',
			dataIndex: 'action',
			key: 'action',
			render: (value: HistoryAction) => {
				const colorMap: Record<HistoryAction, string> = {
					CREATE: 'blue',
					UPDATE: 'cyan',
					DELETE: 'red',
					APPROVE: 'green',
					REJECT: 'volcano',
					TRANSFER_CLUB: 'purple',
				};
				return <Tag color={colorMap[value]}>{value}</Tag>;
			},
		},
		{ title: 'Đối tượng', dataIndex: 'target', key: 'target' },
		{ title: 'Nội dung', dataIndex: 'detail', key: 'detail' },
		{ title: 'Người thao tác', dataIndex: 'operator', key: 'operator', width: 130 },
	];

	return (
		<div style={{ padding: 20 }}>
			<h1>TH05 - Quản lý câu lạc bộ và đăng ký tham gia</h1>
			<Text type='secondary'>
				Quản lý CLB, đơn đăng ký, thành viên và báo cáo thống kê theo yêu cầu bài tập.
			</Text>

			<Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 20 }}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Số CLB' value={stats.clubCount} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Pending' value={stats.pending} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Approved' value={stats.approved} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Đơn Rejected' value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
			</Row>

			<Card style={{ marginBottom: 20 }}>
				{clubs.length === 0 ? (
					<Empty description='Chưa có dữ liệu biểu đồ do chưa tạo câu lạc bộ' />
				) : (
					<ColumnChart
						title='Số đơn đăng ký theo từng CLB'
						xAxis={chartData.xAxis}
						yAxis={chartData.yAxis}
						yLabel={['Pending', 'Approved', 'Rejected']}
						colors={['#faad14', '#52c41a', '#ff4d4f']}
						height={320}
						formatY={(value) => `${Math.round(value)}`}
					/>
				)}
			</Card>

			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<Tabs.TabPane tab='1. Danh sách câu lạc bộ' key='clubs'>
					<Space style={{ marginBottom: 16 }}>
						<Button type='primary' icon={<PlusOutlined />} onClick={openCreateClub}>
							Thêm mới CLB
						</Button>
						<Input
							placeholder='Tìm theo tên CLB/chủ nhiệm'
							allowClear
							style={{ width: 280 }}
							value={clubKeyword}
							onChange={(event) => setClubKeyword(event.target.value)}
						/>
					</Space>
					<Table
						rowKey='id'
						dataSource={filteredClubs}
						columns={clubColumns}
						scroll={{ x: 1400 }}
					/>
				</Tabs.TabPane>

				<Tabs.TabPane tab='2. Quản lý đơn đăng ký' key='applications'>
					<Space style={{ marginBottom: 16 }} wrap>
						<Button type='primary' icon={<PlusOutlined />} onClick={openCreateApplication}>
							Thêm mới đơn
						</Button>
						<Button
							type='primary'
							icon={<CheckCircleOutlined />}
							disabled={selectedApplicationRowKeys.length === 0}
							onClick={() => applyApproval(selectedApplicationRowKeys)}
						>
							Duyệt {selectedApplicationRowKeys.length} đơn đã chọn
						</Button>
						<Button
							danger
							icon={<CloseCircleOutlined />}
							disabled={selectedApplicationRowKeys.length === 0}
							onClick={() => openRejectModal(selectedApplicationRowKeys)}
						>
							Không duyệt {selectedApplicationRowKeys.length} đơn đã chọn
						</Button>
						<Button onClick={() => setHistoryModalVisible(true)}>Xem lịch sử thao tác</Button>
						<Input
							placeholder='Tìm theo họ tên/email/SĐT'
							allowClear
							style={{ width: 260 }}
							value={applicationKeyword}
							onChange={(event) => setApplicationKeyword(event.target.value)}
						/>
					</Space>

					<Table
						rowKey='id'
						dataSource={filteredApplications}
						columns={applicationColumns}
						scroll={{ x: 1800 }}
						rowSelection={{
							selectedRowKeys: selectedApplicationRowKeys,
							onChange: (keys) => setSelectedApplicationRowKeys(keys as string[]),
						}}
					/>
				</Tabs.TabPane>

				<Tabs.TabPane tab='3. Quản lý thành viên CLB' key='members'>
					<Space style={{ marginBottom: 16 }} wrap>
						<Button
							type='primary'
							disabled={selectedMemberRowKeys.length === 0}
							onClick={openTransferModal}
						>
							Đổi CLB cho {selectedMemberRowKeys.length} thành viên đã chọn
						</Button>
						<Input
							placeholder='Tìm theo họ tên/email/SĐT'
							allowClear
							style={{ width: 260 }}
							value={memberKeyword}
							onChange={(event) => setMemberKeyword(event.target.value)}
						/>
						{memberClubFilter && (
							<Tag
								closable
								onClose={() => {
									setMemberClubFilter(undefined);
								}}
							>
								Đang lọc theo CLB: {getClubName(memberClubFilter)}
							</Tag>
						)}
					</Space>
					<Table
						rowKey='id'
						dataSource={filteredMembers}
						columns={memberColumns}
						scroll={{ x: 1300 }}
						rowSelection={{
							selectedRowKeys: selectedMemberRowKeys,
							onChange: (keys) => setSelectedMemberRowKeys(keys as string[]),
						}}
					/>
				</Tabs.TabPane>
			</Tabs>

			<Modal
				title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
				visible={clubModalVisible}
				width={900}
				onCancel={() => {
					setClubModalVisible(false);
					setEditingClub(null);
					clubForm.resetFields();
				}}
				onOk={handleSaveClub}
			>
				<Form form={clubForm} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col xs={24} md={12}>
							<Form.Item name='avatarUrl' label='Ảnh đại diện (URL)'>
								<Input placeholder='https://...' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='name'
								label='Tên câu lạc bộ'
								rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='foundedDate'
								label='Ngày thành lập'
								rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
							>
								<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='president'
								label='Chủ nhiệm CLB'
								rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm CLB' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='status'
								label='Hoạt động'
								rules={[{ required: true, message: 'Vui lòng chọn trạng thái hoạt động' }]}
							>
								<Select>
									<Select.Option value='active'>Có</Select.Option>
									<Select.Option value='inactive'>Không</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name='descriptionHtml' label='Mô tả (HTML)'>
								<TinyEditor height={280} minHeight={120} miniToolbar hideMenubar />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			<Modal
				title={editingApplication ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
				visible={applicationModalVisible}
				width={900}
				onCancel={() => {
					setApplicationModalVisible(false);
					setEditingApplication(null);
					applicationForm.resetFields();
				}}
				onOk={handleSaveApplication}
			>
				<Form form={applicationForm} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col xs={24} md={12}>
							<Form.Item
								name='fullName'
								label='Họ tên'
								rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='email'
								label='Email'
								rules={[
									{ required: true, message: 'Vui lòng nhập email' },
									{ type: 'email', message: 'Email không hợp lệ' },
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='phone'
								label='SĐT'
								rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='gender'
								label='Giới tính'
								rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
							>
								<Select>
									<Select.Option value='Nam'>Nam</Select.Option>
									<Select.Option value='Nữ'>Nữ</Select.Option>
									<Select.Option value='Khác'>Khác</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='address'
								label='Địa chỉ'
								rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='talent'
								label='Sở trường'
								rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='clubId'
								label='Câu lạc bộ'
								rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
							>
								<Select options={clubOptions} />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name='reason'
								label='Lý do đăng ký'
								rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
							>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name='note' label='Ghi chú'>
								<Input.TextArea rows={2} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết đơn đăng ký'
				visible={applicationDetailVisible}
				onCancel={() => setApplicationDetailVisible(false)}
				footer={<Button onClick={() => setApplicationDetailVisible(false)}>Đóng</Button>}
			>
				{viewingApplication ? (
					<Descriptions column={1} bordered size='small'>
						<Descriptions.Item label='Họ tên'>{viewingApplication.fullName}</Descriptions.Item>
						<Descriptions.Item label='Email'>{viewingApplication.email}</Descriptions.Item>
						<Descriptions.Item label='SĐT'>{viewingApplication.phone}</Descriptions.Item>
						<Descriptions.Item label='Giới tính'>{viewingApplication.gender}</Descriptions.Item>
						<Descriptions.Item label='Địa chỉ'>{viewingApplication.address}</Descriptions.Item>
						<Descriptions.Item label='Sở trường'>{viewingApplication.talent}</Descriptions.Item>
						<Descriptions.Item label='Câu lạc bộ'>
							{getClubName(viewingApplication.clubId)}
						</Descriptions.Item>
						<Descriptions.Item label='Lý do đăng ký'>{viewingApplication.reason}</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>
							{viewingApplication.status}
						</Descriptions.Item>
						<Descriptions.Item label='Lý do từ chối'>
							{viewingApplication.rejectionReason || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Ghi chú'>{viewingApplication.note || '-'}</Descriptions.Item>
					</Descriptions>
				) : (
					<Empty description='Không có dữ liệu đơn đăng ký' />
				)}
			</Modal>

			<Modal
				title='Xác nhận từ chối đơn đăng ký'
				visible={rejectModalVisible}
				onCancel={() => {
					setRejectModalVisible(false);
					setPendingRejectIds([]);
					rejectForm.resetFields();
				}}
				onOk={confirmRejectApplications}
			>
				<p style={{ marginBottom: 12 }}>
					Bạn đang từ chối <b>{pendingRejectIds.length}</b> đơn đăng ký. Vui lòng nhập lý do từ chối.
				</p>
				<Form form={rejectForm} layout='vertical'>
					<Form.Item
						name='reason'
						label='Lý do từ chối'
						rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Lịch sử thao tác duyệt/từ chối'
				visible={historyModalVisible}
				width={980}
				onCancel={() => setHistoryModalVisible(false)}
				footer={<Button onClick={() => setHistoryModalVisible(false)}>Đóng</Button>}
			>
				<Table rowKey='id' dataSource={histories} columns={historyColumns} pagination={{ pageSize: 8 }} />
			</Modal>

			<Modal
				title='Chuyển câu lạc bộ cho thành viên'
				visible={transferModalVisible}
				onCancel={() => {
					setTransferModalVisible(false);
					transferForm.resetFields();
				}}
				onOk={handleTransferMembers}
			>
				<p>
					Đổi câu lạc bộ cho <b>{selectedMemberRowKeys.length}</b> thành viên.
				</p>
				<Form form={transferForm} layout='vertical'>
					<Form.Item
						name='targetClubId'
						label='Câu lạc bộ muốn chuyển đến'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
					>
						<Select options={clubOptions} placeholder='Chọn câu lạc bộ' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyHocTapPage;
