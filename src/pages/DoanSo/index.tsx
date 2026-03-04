import { Button, Card, Input, message, Space, Typography, Row, Col, Progress } from 'antd';
import { useState, useEffect } from 'react';
import { TrophyOutlined, ReloadOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DoanSo: React.FC = () => {
	const [randomNumber, setRandomNumber] = useState<number>(0);
	const [guess, setGuess] = useState<string>('');
	const [attempts, setAttempts] = useState<number>(0);
	const [maxAttempts] = useState<number>(10);
	const [history, setHistory] = useState<{ guess: number; feedback: string }[]>([]);
	const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

	// Khởi tạo game
	useEffect(() => {
		startNewGame();
	}, []);

	// Hàm sinh số ngẫu nhiên từ 1-100
	const generateRandomNumber = () => {
		return Math.floor(Math.random() * 100) + 1;
	};

	// Hàm bắt đầu game mới
	const startNewGame = () => {
		const newNumber = generateRandomNumber();
		setRandomNumber(newNumber);
		setGuess('');
		setAttempts(0);
		setHistory([]);
		setGameStatus('playing');
		message.info('Trò chơi mới đã bắt đầu! Hãy đoán số từ 1 đến 100.');
	};

	// Xử lý khi người chơi nhập dự đoán
	const handleGuess = () => {
		if (!guess || guess.trim() === '') {
			message.warning('Vui lòng nhập một số!');
			return;
		}

		const guessNumber = parseInt(guess);

		// Kiểm tra input hợp lệ
		if (isNaN(guessNumber)) {
			message.error('Vui lòng nhập một số hợp lệ!');
			return;
		}

		if (guessNumber < 1 || guessNumber > 100) {
			message.error('Vui lòng nhập số trong khoảng từ 1 đến 100!');
			return;
		}

		// Kiểm tra xem đã đoán số này chưa
		if (history.some((h) => h.guess === guessNumber)) {
			message.warning('Bạn đã đoán số này rồi!');
			return;
		}

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);

		let feedback = '';

		// Kiểm tra kết quả
		if (guessNumber === randomNumber) {
			feedback = 'Chúc mừng! Bạn đã đoán đúng!';
			setGameStatus('won');
			message.success(feedback);
		} else if (guessNumber < randomNumber) {
			feedback = 'Bạn đoán quá thấp!';
			message.info(feedback);
		} else {
			feedback = 'Bạn đoán quá cao!';
			message.info(feedback);
		}

		// Thêm vào lịch sử
		setHistory([...history, { guess: guessNumber, feedback }]);

		// Kiểm tra hết lượt
		if (newAttempts >= maxAttempts && guessNumber !== randomNumber) {
			setGameStatus('lost');
			message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
		}

		setGuess('');
	};

	// Xử lý khi nhấn Enter
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && gameStatus === 'playing') {
			handleGuess();
		}
	};

	// Tính % hoàn thành
	const progressPercent = (attempts / maxAttempts) * 100;

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ textAlign: 'center', marginBottom: '30px' }}>
				<Title level={2}>
					<TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
					Trò Chơi Đoán Số
				</Title>
				<Text type="secondary">
					Hệ thống đã chọn một số ngẫu nhiên từ 1 đến 100. Bạn có {maxAttempts} lượt để đoán!
				</Text>
			</div>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title="Khu vực chơi" bordered>
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<div>
								<Text strong>Lượt đã chơi: </Text>
								<Text style={{ fontSize: '16px', color: attempts >= maxAttempts ? '#ff4d4f' : '#1890ff' }}>
									{attempts}/{maxAttempts}
								</Text>
								<Progress 
									percent={progressPercent} 
									strokeColor={attempts >= maxAttempts ? '#ff4d4f' : '#1890ff'}
									style={{ marginTop: '8px' }}
								/>
							</div>

							<div>
								<Text strong style={{ display: 'block', marginBottom: '8px' }}>
									Nhập số dự đoán (1-100):
								</Text>
								<Input
									size="large"
									type="number"
									min={1}
									max={100}
									value={guess}
									onChange={(e) => setGuess(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Nhập số từ 1 đến 100"
									disabled={gameStatus !== 'playing'}
									style={{ marginBottom: '12px' }}
								/>
							</div>

							<Space>
								<Button
									type="primary"
									size="large"
									onClick={handleGuess}
									disabled={gameStatus !== 'playing'}
								>
									Đoán
								</Button>
								<Button
									size="large"
									icon={<ReloadOutlined />}
									onClick={startNewGame}
								>
									Chơi lại
								</Button>
							</Space>

							{gameStatus === 'won' && (
								<Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
									<div style={{ textAlign: 'center' }}>
										<SmileOutlined
											style={{ fontSize: '48px', color: '#52c41a', marginBottom: '12px' }}
										/>
										<Title level={4} style={{ color: '#52c41a', marginBottom: '8px' }}>
											Chúc mừng! Bạn đã đoán đúng!
										</Title>
										<Text>Bạn đã đoán đúng số <Text strong>{randomNumber}</Text> sau <Text strong>{attempts}</Text> lượt!</Text>
									</div>
								</Card>
							)}

							{gameStatus === 'lost' && (
								<Card style={{ backgroundColor: '#fff2e8', borderColor: '#ffbb96' }}>
									<div style={{ textAlign: 'center' }}>
										<FrownOutlined
											style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '12px' }}
										/>
										<Title level={4} style={{ color: '#ff4d4f', marginBottom: '8px' }}>
											Đã hết lượt!
										</Title>
										<Text>
											Số đúng là: <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>{randomNumber}</Text>
										</Text>
									</div>
								</Card>
							)}
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title={`Lịch sử đoán (${history.length} lần)`} bordered>
						{history.length === 0 ? (
							<Text type="secondary">Chưa có lượt đoán nào...</Text>
						) : (
							<div style={{ maxHeight: '450px', overflowY: 'auto' }}>
								{history.map((item, index) => (
									<Card
										key={index}
										size="small"
										style={{ marginBottom: '8px' }}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div>
												<Text type="secondary">Lần {index + 1}: </Text>
												<Text strong style={{ fontSize: '18px', marginLeft: '8px' }}>
													{item.guess}
												</Text>
											</div>
											<Text style={{ color: item.feedback.includes('đúng') ? '#52c41a' : '#666' }}>
												{item.feedback}
											</Text>
										</div>
									</Card>
								))}
							</div>
						)}
					</Card>

					<Card title="Hướng dẫn chơi" bordered style={{ marginTop: '16px' }}>
						<ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
							<li>Hệ thống sẽ tự động sinh ra một số ngẫu nhiên từ 1 đến 100</li>
							<li>Bạn có tối đa {maxAttempts} lượt để đoán số đó</li>
							<li>Sau mỗi lần đoán, hệ thống sẽ cho biết số bạn đoán cao hơn hay thấp hơn</li>
							<li>Nếu đoán đúng, bạn sẽ thắng! Nếu hết {maxAttempts} lượt mà chưa đoán đúng, bạn sẽ thua</li>
							<li>Nhấn "Chơi lại" để bắt đầu trò chơi mới</li>
						</ul>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DoanSo;
