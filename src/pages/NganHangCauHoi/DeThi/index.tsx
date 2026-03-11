import {
	Alert, Button, Card, Col, Collapse, Descriptions, Form,
	InputNumber, message, Modal, Popconfirm, Row, Select,
	Space, Table, Tag, Tooltip, Typography,
} from 'antd';
import { useState } from 'react';
import {
	PlusOutlined, DeleteOutlined, ThunderboltOutlined,
	SaveOutlined, EyeOutlined, MinusCircleOutlined,
} from '@ant-design/icons';
import {
	CauTrucDeThi, DeThi, generateId, getCauHois, getDeThi,
	getKhoiKienThucs, getMonHocs, MUC_DO_KHO_COLOR, MUC_DO_KHO_LABEL,
	MucDoKho, saveDeThi,
} from '../data';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const ALL_MUC_DO: MucDoKho[] = ['De', 'TrungBinh', 'Kho', 'RatKho'];

interface GeneratedExam {
	maDe: string;
	monHocId: string;
	cauTruc: CauTrucDeThi[];
	cauHoiIds: string[];
}

const DeThiPage: React.FC = () => {
	const monHocs = getMonHocs();
	const khoiKienThucs = getKhoiKienThucs();
	const cauHois = getCauHois();

	const [savedExams, setSavedExams] = useState<DeThi[]>(getDeThi);
	const [selectedMon, setSelectedMon] = useState<string | undefined>(undefined);
	const [maDe, setMaDe] = useState('');
	const [cauTruc, setCauTruc] = useState<CauTrucDeThi[]>([]);
	const [generated, setGenerated] = useState<GeneratedExam | null>(null);
	const [viewExam, setViewExam] = useState<DeThi | null>(null);
	const [viewModalOpen, setViewModalOpen] = useState(false);

	const getMonTen = (id: string) => monHocs.find((m) => m.id === id)?.tenMon || id;
	const getKhoiTen = (id: string) => khoiKienThucs.find((k) => k.id === id)?.tenKhoi || id;
	const getCauHoiById = (id: string) => cauHois.find((c) => c.id === id);

	const addCauTruc = () => {
		setCauTruc([...cauTruc, { khoiKienThucId: '', mucDoKho: 'De', soLuong: 1 }]);
	};

	const removeCauTruc = (index: number) => {
		setCauTruc(cauTruc.filter((_, i) => i !== index));
	};

	const updateCauTruc = (index: number, field: keyof CauTrucDeThi, value: any) => {
		setCauTruc(cauTruc.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
	};

	const handleGenerate = () => {
		if (!selectedMon) { message.warning('Vui lòng chọn môn học!'); return; }
		if (!maDe.trim()) { message.warning('Vui lòng nhập mã đề thi!'); return; }
		if (cauTruc.length === 0) { message.warning('Vui lòng thêm ít nhất một cấu trúc câu hỏi!'); return; }

		const invalid = cauTruc.some((c) => !c.khoiKienThucId || !c.mucDoKho || !c.soLuong);
		if (invalid) { message.warning('Vui lòng điền đầy đủ thông tin cấu trúc!'); return; }

		const selectedIds: string[] = [];
		const errors: string[] = [];

		for (const ct of cauTruc) {
			const pool = cauHois.filter(
				(ch) =>
					ch.monHocId === selectedMon &&
					ch.mucDoKho === ct.mucDoKho &&
					ch.khoiKienThucId === ct.khoiKienThucId &&
					!selectedIds.includes(ch.id),
			);
			if (pool.length < ct.soLuong) {
				errors.push(
					`Không đủ câu "${MUC_DO_KHO_LABEL[ct.mucDoKho]}" - "${getKhoiTen(ct.khoiKienThucId)}": cần ${ct.soLuong}, có ${pool.length}`,
				);
			} else {
				// Random pick
				const shuffled = [...pool].sort(() => Math.random() - 0.5);
				selectedIds.push(...shuffled.slice(0, ct.soLuong).map((c) => c.id));
			}
		}

		if (errors.length > 0) {
			message.error(errors.join(' | '));
			return;
		}

		setGenerated({ maDe, monHocId: selectedMon, cauTruc, cauHoiIds: selectedIds });
		message.success(`Tạo đề thành công! ${selectedIds.length} câu hỏi được chọn.`);
	};

	const handleSave = () => {
		if (!generated) return;
		const newExam: DeThi = {
			id: generateId(),
			maDe: generated.maDe,
			monHocId: generated.monHocId,
			cauTruc: generated.cauTruc,
			danhSachCauHoi: generated.cauHoiIds,
			ngayTao: new Date().toLocaleString('vi-VN'),
		};
		const next = [...savedExams, newExam];
		setSavedExams(next);
		saveDeThi(next);
		message.success('Đã lưu đề thi!');
		// Reset
		setGenerated(null);
		setSelectedMon(undefined);
		setMaDe('');
		setCauTruc([]);
	};

	const handleDeleteExam = (id: string) => {
		const next = savedExams.filter((e) => e.id !== id);
		setSavedExams(next);
		saveDeThi(next);
		message.success('Đã xoá đề thi!');
	};

	const openView = (exam: DeThi) => {
		setViewExam(exam);
		setViewModalOpen(true);
	};

	const savedColumns = [
		{ title: 'Mã đề', dataIndex: 'maDe', key: 'maDe', width: 120 },
		{ title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: (id: string) => getMonTen(id) },
		{
			title: 'Số câu hỏi',
			dataIndex: 'danhSachCauHoi',
			key: 'soLuong',
			width: 110,
			align: 'center' as const,
			render: (ids: string[]) => <Tag color="blue">{ids.length} câu</Tag>,
		},
		{ title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 160 },
		{
			title: 'Thao tác',
			key: 'action',
			width: 140,
			render: (_: any, record: DeThi) => (
				<Space>
					<Button type="link" icon={<EyeOutlined />} onClick={() => openView(record)}>Xem</Button>
					<Popconfirm title="Xác nhận xoá?" onConfirm={() => handleDeleteExam(record.id)} okText="Xoá" cancelText="Huỷ">
						<Button type="link" danger icon={<DeleteOutlined />}>Xoá</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Title level={3} style={{ marginBottom: 16 }}>Quản lý đề thi</Title>

			<Row gutter={[16, 16]}>
				{/* Form tạo đề */}
				<Col xs={24} xl={14}>
					<Card
						title="Tạo đề thi mới"
						extra={
							<Space>
								<Button
									type="primary"
									icon={<ThunderboltOutlined />}
									onClick={handleGenerate}
									disabled={!selectedMon || cauTruc.length === 0}
								>
									Tạo đề
								</Button>
								{generated && (
									<Button
										icon={<SaveOutlined />}
										onClick={handleSave}
										style={{ borderColor: '#52c41a', color: '#52c41a' }}
									>
										Lưu đề
									</Button>
								)}
							</Space>
						}
					>
						<Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
							<Col xs={24} sm={12}>
								<label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Mã đề thi *</label>
								<input
									style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 6, fontSize: 14 }}
									placeholder="VD: DE001"
									value={maDe}
									onChange={(e) => setMaDe(e.target.value)}
								/>
							</Col>
							<Col xs={24} sm={12}>
								<label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Môn học *</label>
								<Select
									style={{ width: '100%' }}
									placeholder="Chọn môn học"
									value={selectedMon}
									onChange={(v) => { setSelectedMon(v); setGenerated(null); }}
									allowClear
								>
									{monHocs.map((m) => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
								</Select>
							</Col>
						</Row>

						<div style={{ marginBottom: 8, fontWeight: 500 }}>Cấu trúc đề thi:</div>
						{cauTruc.map((ct, index) => (
							<Card
								key={index}
								size="small"
								style={{ marginBottom: 8, backgroundColor: '#fafafa' }}
								bodyStyle={{ padding: '8px 12px' }}
							>
								<Row gutter={8} align="middle">
									<Col flex="auto">
										<Row gutter={8}>
											<Col xs={24} sm={8}>
												<Select
													placeholder="Khối kiến thức"
													style={{ width: '100%' }}
													value={ct.khoiKienThucId || undefined}
													onChange={(v) => updateCauTruc(index, 'khoiKienThucId', v)}
													size="small"
												>
													{khoiKienThucs.map((k) => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
												</Select>
											</Col>
											<Col xs={24} sm={8}>
												<Select
													placeholder="Mức độ khó"
													style={{ width: '100%' }}
													value={ct.mucDoKho}
													onChange={(v) => updateCauTruc(index, 'mucDoKho', v)}
													size="small"
												>
													{ALL_MUC_DO.map((m) => (
														<Option key={m} value={m}><Tag color={MUC_DO_KHO_COLOR[m]}>{MUC_DO_KHO_LABEL[m]}</Tag></Option>
													))}
												</Select>
											</Col>
											<Col xs={24} sm={8}>
												<InputNumber
													min={1}
													max={50}
													value={ct.soLuong}
													onChange={(v) => updateCauTruc(index, 'soLuong', v || 1)}
													addonBefore="Số câu"
													style={{ width: '100%' }}
													size="small"
												/>
											</Col>
										</Row>
									</Col>
									<Col>
										<Tooltip title="Xoá dòng">
											<Button
												type="text"
												danger
												icon={<MinusCircleOutlined />}
												size="small"
												onClick={() => removeCauTruc(index)}
											/>
										</Tooltip>
									</Col>
								</Row>
							</Card>
						))}

						<Button
							type="dashed"
							icon={<PlusOutlined />}
							onClick={addCauTruc}
							style={{ width: '100%', marginTop: 4 }}
						>
							Thêm dòng cấu trúc
						</Button>

						{/* Preview đề đã tạo */}
						{generated && (
							<Card
								style={{ marginTop: 16, borderColor: '#52c41a' }}
								title={<span style={{ color: '#52c41a' }}>✅ Đề thi đã tạo — {generated.cauHoiIds.length} câu hỏi</span>}
								size="small"
							>
								{generated.cauHoiIds.map((id, idx) => {
									const ch = getCauHoiById(id);
									if (!ch) return null;
									return (
										<div key={id} style={{ marginBottom: 8, padding: '6px 10px', background: '#f6ffed', borderRadius: 6 }}>
											<Text strong>Câu {idx + 1}.</Text>{' '}
											<Tag color={MUC_DO_KHO_COLOR[ch.mucDoKho]} style={{ marginLeft: 4 }}>{MUC_DO_KHO_LABEL[ch.mucDoKho]}</Tag>
											<Tag>{getKhoiTen(ch.khoiKienThucId)}</Tag>
											<div style={{ marginTop: 4 }}>{ch.noiDung}</div>
										</div>
									);
								})}
							</Card>
						)}
					</Card>
				</Col>

				{/* Danh sách đề đã lưu */}
				<Col xs={24} xl={10}>
					<Card title={`Đề thi đã lưu (${savedExams.length})`}>
						<Table
							rowKey="id"
							columns={savedColumns}
							dataSource={savedExams}
							pagination={{ pageSize: 5 }}
							size="small"
							bordered
						/>
					</Card>
				</Col>
			</Row>

			{/* Modal xem đề thi */}
			<Modal
				title={`Xem đề thi: ${viewExam?.maDe}`}
				open={viewModalOpen}
				onCancel={() => setViewModalOpen(false)}
				footer={<Button onClick={() => setViewModalOpen(false)}>Đóng</Button>}
				width={700}
			>
				{viewExam && (
					<>
						<Descriptions bordered size="small" style={{ marginBottom: 16 }}>
							<Descriptions.Item label="Mã đề">{viewExam.maDe}</Descriptions.Item>
							<Descriptions.Item label="Môn học">{getMonTen(viewExam.monHocId)}</Descriptions.Item>
							<Descriptions.Item label="Ngày tạo">{viewExam.ngayTao}</Descriptions.Item>
							<Descriptions.Item label="Tổng câu hỏi" span={3}>
								<Tag color="blue">{viewExam.danhSachCauHoi.length} câu</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Cấu trúc" span={3}>
								{viewExam.cauTruc.map((ct, i) => (
									<Tag key={i} style={{ marginBottom: 4 }}>
										{getKhoiTen(ct.khoiKienThucId)} / {MUC_DO_KHO_LABEL[ct.mucDoKho]}: {ct.soLuong} câu
									</Tag>
								))}
							</Descriptions.Item>
						</Descriptions>
						<div style={{ maxHeight: 400, overflowY: 'auto' }}>
							{viewExam.danhSachCauHoi.map((id, idx) => {
								const ch = getCauHoiById(id);
								if (!ch) return null;
								return (
									<div key={id} style={{ marginBottom: 10, padding: '8px 12px', background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8' }}>
										<Space>
											<Text strong>Câu {idx + 1}.</Text>
											<Tag color={MUC_DO_KHO_COLOR[ch.mucDoKho]}>{MUC_DO_KHO_LABEL[ch.mucDoKho]}</Tag>
											<Tag>{getKhoiTen(ch.khoiKienThucId)}</Tag>
										</Space>
										<div style={{ marginTop: 6 }}>{ch.noiDung}</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default DeThiPage;
