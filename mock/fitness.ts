import moment from 'moment';
import type { WorkoutLog, HealthMetrics, Goal, Exercise, DashboardStats, WeeklyWorkoutData, WeightTrendData } from '@/models/fitness';

// ============= MOCK DATA GENERATION =============

export const generateMockWorkouts = (): WorkoutLog[] => {
	const today = moment();
	const workouts: WorkoutLog[] = [];
	const exerciseTypes: Array<'CARDIO' | 'STRENGTH' | 'YOGA' | 'HIIT' | 'OTHER'> = ['CARDIO', 'STRENGTH', 'YOGA', 'HIIT', 'OTHER'];
	const statuses: Array<'COMPLETED' | 'MISSED'> = ['COMPLETED', 'MISSED'];

	for (let i = 0; i < 30; i++) {
		const date = today.clone().subtract(i, 'days');
		const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
		const duration = Math.floor(Math.random() * 120) + 30;
		const calories = Math.floor(Math.random() * 400) + 100;

		workouts.push({
			id: `W${String(i + 1).padStart(3, '0')}`,
			date: date.format('YYYY-MM-DD'),
			exerciseType,
			duration,
			calories,
			notes: `Buổi tập ${exerciseType}`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
		});
	}

	return workouts;
};

export const generateMockHealthMetrics = (): HealthMetrics[] => {
	const today = moment();
	const metrics: HealthMetrics[] = [];

	for (let i = 0; i < 30; i++) {
		const date = today.clone().subtract(i * 2, 'days');
		const weight = 70 + Math.random() * 5;
		const height = 175;
		const bmi = Math.round((weight / ((height / 100) * (height / 100))) * 10) / 10;

		metrics.push({
			id: `HM${String(i + 1).padStart(3, '0')}`,
			date: date.format('YYYY-MM-DD'),
			weight,
			height,
			restingHeartRate: Math.floor(Math.random() * 20) + 60,
			sleepHours: Math.round((Math.random() * 3 + 6) * 10) / 10,
			bmi,
			bmiCategory: bmi < 18.5 ? 'UNDERWEIGHT' : bmi < 25 ? 'NORMAL' : bmi < 30 ? 'OVERWEIGHT' : 'OBESE',
		});
	}

	return metrics;
};

export const generateMockGoals = (): Goal[] => {
	const createdAt = moment().format('YYYY-MM-DD');

	return [
		{
			id: 'G001',
			name: 'Giảm cân 5kg',
			type: 'WEIGHT_LOSS',
			targetValue: 65,
			currentValue: 70,
			deadline: moment().add(3, 'months').format('YYYY-MM-DD'),
			status: 'IN_PROGRESS',
			createdAt,
			updatedAt: createdAt,
		},
		{
			id: 'G002',
			name: 'Chạy 5km trong 30 phút',
			type: 'ENDURANCE',
			targetValue: 1,
			currentValue: 1,
			deadline: moment().add(2, 'months').format('YYYY-MM-DD'),
			status: 'COMPLETED',
			createdAt,
			updatedAt: createdAt,
		},
		{
			id: 'G003',
			name: 'Tăng khối lượng cơ',
			type: 'MUSCLE_GAIN',
			targetValue: 75,
			currentValue: 70,
			deadline: moment().add(6, 'months').format('YYYY-MM-DD'),
			status: 'IN_PROGRESS',
			createdAt,
			updatedAt: createdAt,
		},
		{
			id: 'G004',
			name: 'Tập Yoga 3 lần/tuần',
			type: 'OTHER',
			targetValue: 12,
			currentValue: 8,
			deadline: moment().add(1, 'months').format('YYYY-MM-DD'),
			status: 'IN_PROGRESS',
			createdAt,
			updatedAt: createdAt,
		},
	];
};

export const generateMockExercises = (): Exercise[] => {
	return [
		{
			id: 'E001',
			name: 'Chạy bộ',
			muscleGroup: 'FULL_BODY',
			difficulty: 'EASY',
			description: 'Chạy bộ đều đặn trên đường bộ',
			instructions: '1. Khởi động 5 phút\n2. Chạy với tốc độ đều\n3. Thả lỏng và phục hồi 5 phút',
			caloriesPerHour: 600,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E002',
			name: 'Nâng tạ',
			muscleGroup: 'STRENGTH',
			difficulty: 'HARD',
			description: 'Nâng tạ để xây dựng cơ bắp',
			instructions: '1. Chọn tạ phù hợp\n2. Thực hiện các bài tập cơ bản\n3. Thực hiện 3 set, 8-12 lần lặp',
			caloriesPerHour: 400,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E003',
			name: 'Yoga',
			muscleGroup: 'FULL_BODY',
			difficulty: 'EASY',
			description: 'Tập yoga để thư giãn và linh hoạt',
			instructions: '1. Tìm một không gian yên tĩnh\n2. Thực hiện các tư thế yoga cơ bản\n3. Kết thúc bằng tư thế shavasana',
			caloriesPerHour: 200,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E004',
			name: 'HIIT Training',
			muscleGroup: 'FULL_BODY',
			difficulty: 'HARD',
			description: 'Bài tập cường độ cao với khoảng nghỉ',
			instructions: '1. Khởi động 3 phút\n2. Thực hiện bài tập 30 giây\n3. Nghỉ 30 giây\n4. Lặp 10 vòng',
			caloriesPerHour: 900,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E005',
			name: 'Đẩy tạ',
			muscleGroup: 'CHEST',
			difficulty: 'MEDIUM',
			description: 'Bài tập để tăng cơ ngực',
			instructions: '1. Nằm trên ghế tập\n2. Đẩy tạ lên và hạ xuống\n3. Thực hiện 3 set, 10-15 lần',
			caloriesPerHour: 350,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E006',
			name: 'Kéo xà',
			muscleGroup: 'BACK',
			difficulty: 'MEDIUM',
			description: 'Bài tập lưng cơ bản',
			instructions: '1. Nắm chắc xà\n2. Kéo cơ thể lên\n3. Hạ xuống\n4. Thực hiện 3 set, 8-12 lần',
			caloriesPerHour: 400,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E007',
			name: 'Squat',
			muscleGroup: 'LEGS',
			difficulty: 'MEDIUM',
			description: 'Bài tập chân cơ bản',
			instructions: '1. Đứng thẳng, chân cách rộng\n2. Hạ xuống như ngồi\n3. Đứng lên\n4. Thực hiện 3 set, 15-20 lần',
			caloriesPerHour: 500,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
		{
			id: 'E008',
			name: 'Plank',
			muscleGroup: 'CORE',
			difficulty: 'EASY',
			description: 'Bài tập core cơ bản',
			instructions: '1. Nằm sấp\n2. Tựa vào tay và bàn chân\n3. Giữ thẳng cơ thể\n4. Giữ 30-60 giây, 3 set',
			caloriesPerHour: 300,
			createdAt: moment().format('YYYY-MM-DD'),
			updatedAt: moment().format('YYYY-MM-DD'),
		},
	];
};

export const generateDashboardStats = (): DashboardStats => {
	return {
		totalWorkoutsThisMonth: 15,
		totalCaloriesBurned: 5000,
		consecutiveDays: 7,
		goalCompletionPercentage: 65,
	};
};

export const generateWeeklyWorkoutData = (): WeeklyWorkoutData[] => {
	return [
		{ week: 'Tuần 1', workouts: 3 },
		{ week: 'Tuần 2', workouts: 4 },
		{ week: 'Tuần 3', workouts: 3 },
		{ week: 'Tuần 4', workouts: 5 },
	];
};

export const generateWeightTrendData = (): WeightTrendData[] => {
	const today = moment();
	const data: WeightTrendData[] = [];

	for (let i = 29; i >= 0; i -= 2) {
		data.push({
			date: today.clone().subtract(i, 'days').format('YYYY-MM-DD'),
			weight: 70 + Math.random() * 5,
		});
	}

	return data;
};
