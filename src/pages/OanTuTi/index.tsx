import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface RoundHistory {
	key: number;
	round: number;
	playerChoice: Choice;
	computerChoice: Choice;
	result: Result;
}

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];

const CHOICE_EMOJI: Record<Choice, string> = {
	'Kéo': '✌️',
	'Búa': '✊',
	'Bao': '🖐️',
};

// Kéo thua Búa, Búa thua Bao, Bao thua Kéo
const getResult = (player: Choice, computer: Choice): Result => {
	if (player === computer) return 'Hòa';
	if (
		(player === 'Kéo' && computer === 'Bao') ||
		(player === 'Búa' && computer === 'Kéo') ||
		(player === 'Bao' && computer === 'Búa')
	) {
		return 'Thắng';
	}
	return 'Thua';
};

const getRandomChoice = (): Choice => {
	return CHOICES[Math.floor(Math.random() * CHOICES.length)];
};

const OanTuTi: React.FC = () => {
	const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
	const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
	const [result, setResult] = useState<Result | null>(null);
	const [history, setHistory] = useState<RoundHistory[]>([]);
	const [round, setRound] = useState<number>(0);
	const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
	const [isAnimating, setIsAnimating] = useState(false);

	const handlePlay = (choice: Choice) => {
		if (isAnimating) return;
		setIsAnimating(true);

		const compChoice = getRandomChoice();
		const roundResult = getResult(choice, compChoice);
		const newRound = round + 1;

		setPlayerChoice(choice);
		setComputerChoice(compChoice);
		setResult(roundResult);
		setRound(newRound);

		setScore((prev) => ({
			win: prev.win + (roundResult === 'Thắng' ? 1 : 0),
			lose: prev.lose + (roundResult === 'Thua' ? 1 : 0),
			draw: prev.draw + (roundResult === 'Hòa' ? 1 : 0),
		}));

		setHistory((prev) => [
			{
				key: newRound,
				round: newRound,
				playerChoice: choice,
				computerChoice: compChoice,
				result: roundResult,
			},
			...prev,
		]);

		setTimeout(() => setIsAnimating(false), 300);
	};

	const handleReset = () => {
		setPlayerChoice(null);
		setComputerChoice(null);
		setResult(null);
		setRound(0);
		setScore({ win: 0, lose: 0, draw: 0 });
		setHistory([]);
	};

	const resultColor: Record<Result, string> = {
		Thắng: '#52c41a',
		Thua: '#ff4d4f',
		Hòa: '#faad14',
	};

	const resultTagColor: Record<Result, string> = {
		Thắng: 'success',
		Thua: 'error',
		Hòa: 'warning',
	};

	const columns = [
		{
			title: 'Ván',
			dataIndex: 'round',
			key: 'round',
			width: 60,
			align: 'center' as const,
		},
		{
			title: 'Bạn chọn',
			dataIndex: 'playerChoice',
			key: 'playerChoice',
			align: 'center' as const,
			render: (val: Choice) => (
				<span style={{ fontSize: 18 }}>
					{CHOICE_EMOJI[val]} {val}
				</span>
			),
		},
		{
			title: 'Máy chọn',
			dataIndex: 'computerChoice',
			key: 'computerChoice',
			align: 'center' as const,
			render: (val: Choice) => (
				<span style={{ fontSize: 18 }}>
					{CHOICE_EMOJI[val]} {val}
				</span>
			),
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			align: 'center' as const,
			render: (val: Result) => (
				<Tag color={resultTagColor[val]} style={{ fontWeight: 'bold', fontSize: 14 }}>
					{val}
				</Tag>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<Title level={2}>✂️ Oẳn Tù Tì 🤜🖐️</Title>
				<Text type="secondary">Chọn Kéo, Búa hoặc Bao để đấu với máy!</Text>
			</div>

			<Row gutter={[16, 16]}>
				{/* Khu vực chơi */}
				<Col xs={24} lg={14}>
					<Card title="Khu vực chơi" bordered>
						{/* Nút chọn */}
						<div style={{ textAlign: 'center', marginBottom: 24 }}>
							<Text strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>
								Hãy chọn của bạn:
							</Text>
							<Space size="large">
								{CHOICES.map((choice) => (
									<Button
										key={choice}
										type="primary"
										size="large"
										onClick={() => handlePlay(choice)}
										disabled={isAnimating}
										style={{
											height: 80,
											width: 100,
											fontSize: 14,
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 4,
										}}
									>
										<span style={{ fontSize: 28 }}>{CHOICE_EMOJI[choice]}</span>
										<span>{choice}</span>
									</Button>
								))}
							</Space>
						</div>

						{/* Kết quả ván hiện tại */}
						{result && playerChoice && computerChoice && (
							<Card
								style={{
									textAlign: 'center',
									backgroundColor: '#fafafa',
									border: `2px solid ${resultColor[result]}`,
									borderRadius: 12,
								}}
							>
								<Row justify="space-around" align="middle">
									<Col>
										<div style={{ fontSize: 18, marginBottom: 4, fontWeight: 'bold' }}>Bạn</div>
										<div style={{ fontSize: 48 }}>{CHOICE_EMOJI[playerChoice]}</div>
										<div style={{ fontSize: 16, marginTop: 4 }}>{playerChoice}</div>
									</Col>
									<Col>
										<Title
											level={2}
											style={{
												color: resultColor[result],
												margin: 0,
												fontSize: 36,
											}}
										>
											{result === 'Thắng' ? '🏆 Bạn thắng!' : result === 'Thua' ? '😢 Bạn thua!' : '🤝 Hòa!'}
										</Title>
									</Col>
									<Col>
										<div style={{ fontSize: 18, marginBottom: 4, fontWeight: 'bold' }}>Máy</div>
										<div style={{ fontSize: 48 }}>{CHOICE_EMOJI[computerChoice]}</div>
										<div style={{ fontSize: 16, marginTop: 4 }}>{computerChoice}</div>
									</Col>
								</Row>
							</Card>
						)}

						{!result && (
							<div
								style={{
									textAlign: 'center',
									padding: '32px',
									color: '#bbb',
									fontSize: 16,
									border: '2px dashed #e8e8e8',
									borderRadius: 12,
								}}
							>
								Nhấn chọn để bắt đầu đấu! 🎮
							</div>
						)}
					</Card>
				</Col>

				{/* Bảng điểm */}
				<Col xs={24} lg={10}>
					<Card
						title="Bảng điểm"
						extra={
							<Button size="small" danger onClick={handleReset}>
								Chơi lại
							</Button>
						}
						bordered
					>
						<Row gutter={[8, 8]} style={{ textAlign: 'center', marginBottom: 12 }}>
							<Col span={8}>
								<Card
									size="small"
									style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
								>
									<div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
										{score.win}
									</div>
									<div style={{ color: '#52c41a' }}>Thắng</div>
								</Card>
							</Col>
							<Col span={8}>
								<Card
									size="small"
									style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}
								>
									<div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
										{score.draw}
									</div>
									<div style={{ color: '#faad14' }}>Hòa</div>
								</Card>
							</Col>
							<Col span={8}>
								<Card
									size="small"
									style={{ backgroundColor: '#fff1f0', border: '1px solid #ffa39e' }}
								>
									<div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
										{score.lose}
									</div>
									<div style={{ color: '#ff4d4f' }}>Thua</div>
								</Card>
							</Col>
						</Row>
						<Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
							Tổng số ván: <strong>{round}</strong>
						</Text>
					</Card>
				</Col>
			</Row>

			{/* Lịch sử */}
			<Row style={{ marginTop: 16 }}>
				<Col span={24}>
					<Card title={`Lịch sử kết quả (${history.length} ván)`} bordered>
						{history.length === 0 ? (
							<div style={{ textAlign: 'center', color: '#bbb', padding: '16px 0' }}>
								Chưa có ván đấu nào. Hãy bắt đầu chơi!
							</div>
						) : (
							<Table
								columns={columns}
								dataSource={history}
								pagination={{ pageSize: 10 }}
								size="small"
								scroll={{ x: 400 }}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default OanTuTi;
