import { Card, Col, Row, Statistic, Timeline, Empty, Skeleton, Typography, Space } from 'antd';
import { FireOutlined, CalendarOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import type { WorkoutLog } from '@/models/fitness';
import {
	getDashboardStats,
	getWeeklyWorkoutData,
	getWeightTrendData,
	getRecentWorkouts,
} from '@/services/fitness';
import WeeklyChart from './components/WeeklyChart';
import WeightChart from './components/WeightChart';
import styles from './index.less';

const { Title } = Typography;

export default function Dashboard() {
	const [stats, setStats] = useState<any>(null);
	const [weeklyData, setWeeklyData] = useState<any[]>([]);
	const [weightData, setWeightData] = useState<any[]>([]);
	const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [statsData, weeklyChartData, weightChartData, recentData] = await Promise.all([
				getDashboardStats(),
				getWeeklyWorkoutData(),
				getWeightTrendData(),
				getRecentWorkouts(5),
			]);

			setStats(statsData);
			setWeeklyData(weeklyChartData);
			setWeightData(weightChartData);
			setRecentWorkouts(recentData);
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.dashboard}>
				<Skeleton active paragraph={{ rows: 6 }} />
			</div>
		);
	}

	const getExerciseTypeLabel = (type: string): string => {
		const typeMap: Record<string, string> = {
			CARDIO: 'Cardio',
			STRENGTH: 'Sức mạnh',
			YOGA: 'Yoga',
			HIIT: 'HIIT',
			OTHER: 'Khác',
		};
		return typeMap[type] || type;
	};

	const getStatusBadge = (status: string) => {
		return status === 'COMPLETED' ? '✓ Hoàn thành' : '✗ Bỏ lỡ';
	};

	return (
		<div className={styles.dashboard}>
			{/* Quick Stats Cards */}
			<Row gutter={[16, 16]} className={styles.statsRow}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable className={styles.statCard}>
						<Statistic
							title="Tổng buổi tập (tháng)"
							value={stats?.totalWorkoutsThisMonth || 0}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable className={styles.statCard}>
						<Statistic
							title="Tổng calo đã đốt"
							value={stats?.totalCaloriesBurned || 0}
							suffix="kcal"
							prefix={<FireOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable className={styles.statCard}>
						<Statistic
							title="Ngày tập liên tiếp (Streak)"
							value={stats?.consecutiveDays || 0}
							suffix="ngày"
							prefix={<ThunderboltOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable className={styles.statCard}>
						<Statistic
							title="Mục tiêu hoàn thành"
							value={stats?.goalCompletionPercentage || 0}
							suffix="%"
							prefix={<TrophyOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts */}
			<Row gutter={[16, 16]} className={styles.chartsRow}>
				<Col xs={24} lg={12}>
					<Card title="Buổi tập theo tuần (tháng này)">
						<WeeklyChart data={weeklyData} />
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title="Xu hướng cân nặng">
						<WeightChart data={weightData} />
					</Card>
				</Col>
			</Row>

			{/* Recent Workouts Timeline */}
			<Card title="5 buổi tập gần nhất" className={styles.recentWorkouts}>
				{recentWorkouts.length > 0 ? (
					<Timeline
						items={recentWorkouts.map((workout) => ({
							color: workout.status === 'COMPLETED' ? 'green' : 'red',
							children: (
								<div>
									<p style={{ marginBottom: '4px' }}>
										<strong>{getExerciseTypeLabel(workout.exerciseType)}</strong> -
										{moment(workout.date).format('DD/MM/YYYY')}
									</p>
									<Space size="small">
										<span>⏱ {workout.duration} phút</span>
										<span>🔥 {workout.calories} kcal</span>
										<span>{getStatusBadge(workout.status)}</span>
									</Space>
									{workout.notes && <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>{workout.notes}</p>}
								</div>
							),
						}))}
					/>
				) : (
					<Empty description="Chưa có buổi tập nào" />
				)}
			</Card>
		</div>
	);
}
