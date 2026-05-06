import type {
	BMICategory,
	BMIInfo,
	DashboardStats,
	Exercise,
	ExerciseType,
	Goal,
	GoalStatus,
	GoalType,
	HealthMetrics,
	MuscleGroup,
	WeeklyWorkoutData,
	WeightTrendData,
	WorkoutLog,
} from '@/models/fitness';
import { request } from 'umi';

// ============= BMI UTILITIES =============
export const calculateBMI = (weight: number, height: number): number => {
	const heightInMeters = height / 100;
	return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const getBMICategory = (bmi: number): BMICategory => {
	if (bmi < 18.5) return 'UNDERWEIGHT';
	if (bmi < 25) return 'NORMAL';
	if (bmi < 30) return 'OVERWEIGHT';
	return 'OBESE';
};

export const getBMIInfo = (bmi: number): BMIInfo => {
	const category = getBMICategory(bmi);
	const categoryMap: Record<BMICategory, { label: string; color: string }> = {
		UNDERWEIGHT: { label: 'Thiếu cân', color: 'blue' },
		NORMAL: { label: 'Bình thường', color: 'green' },
		OVERWEIGHT: { label: 'Thừa cân', color: 'gold' },
		OBESE: { label: 'Béo phì', color: 'red' },
	};

	return {
		value: bmi,
		category,
		...categoryMap[category],
	};
};

// ============= WORKOUT LOG SERVICES =============
export async function getWorkoutLogs(
	startDate?: string,
	endDate?: string,
	exerciseType?: ExerciseType,
): Promise<WorkoutLog[]> {
	try {
		return await request('/api/workouts', {
			params: {
				startDate,
				endDate,
				exerciseType,
			},
		});
	} catch (error) {
		console.error('Error fetching workout logs:', error);
		return [];
	}
}

export async function createWorkoutLog(data: Omit<WorkoutLog, 'id'>): Promise<WorkoutLog> {
	return request('/api/workouts', {
		method: 'POST',
		data,
	});
}

export async function updateWorkoutLog(id: string, data: Partial<WorkoutLog>): Promise<WorkoutLog> {
	return request(`/api/workouts/${id}`, {
		method: 'PUT',
		data,
	});
}

export async function deleteWorkoutLog(id: string): Promise<void> {
	return request(`/api/workouts/${id}`, {
		method: 'DELETE',
	});
}

// ============= HEALTH METRICS SERVICES =============
export async function getHealthMetrics(startDate?: string, endDate?: string): Promise<HealthMetrics[]> {
	try {
		const metrics = await request('/api/health-metrics', {
			params: {
				startDate,
				endDate,
			},
		});

		return metrics.map((m: any) => ({
			...m,
			bmi: calculateBMI(m.weight, m.height),
			bmiCategory: getBMICategory(calculateBMI(m.weight, m.height)),
		}));
	} catch (error) {
		console.error('Error fetching health metrics:', error);
		return [];
	}
}

export async function createHealthMetrics(data: Omit<HealthMetrics, 'id' | 'bmi' | 'bmiCategory'>): Promise<HealthMetrics> {
	const bmi = calculateBMI(data.weight, data.height);
	const payload = {
		...data,
		bmi,
		bmiCategory: getBMICategory(bmi),
	};

	return request('/api/health-metrics', {
		method: 'POST',
		data: payload,
	});
}

export async function updateHealthMetrics(
	id: string,
	data: Partial<Omit<HealthMetrics, 'id'>>,
): Promise<HealthMetrics> {
	let payload = { ...data };

	if (data.weight !== undefined && data.height !== undefined) {
		const bmi = calculateBMI(data.weight, data.height);
		payload = {
			...payload,
			bmi,
			bmiCategory: getBMICategory(bmi),
		};
	}

	return request(`/api/health-metrics/${id}`, {
		method: 'PUT',
		data: payload,
	});
}

export async function deleteHealthMetrics(id: string): Promise<void> {
	return request(`/api/health-metrics/${id}`, {
		method: 'DELETE',
	});
}

// ============= GOAL SERVICES =============
export async function getGoals(status?: GoalStatus): Promise<Goal[]> {
	try {
		return await request('/api/goals', {
			params: {
				status,
			},
		});
	} catch (error) {
		console.error('Error fetching goals:', error);
		return [];
	}
}

export async function createGoal(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
	return request('/api/goals', {
		method: 'POST',
		data,
	});
}

export async function updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
	return request(`/api/goals/${id}`, {
		method: 'PUT',
		data,
	});
}

export async function deleteGoal(id: string): Promise<void> {
	return request(`/api/goals/${id}`, {
		method: 'DELETE',
	});
}

// ============= EXERCISE LIBRARY SERVICES =============
export async function getExercises(
	muscleGroup?: MuscleGroup,
	difficulty?: string,
): Promise<Exercise[]> {
	try {
		return await request('/api/exercises', {
			params: {
				muscleGroup,
				difficulty,
			},
		});
	} catch (error) {
		console.error('Error fetching exercises:', error);
		return [];
	}
}

export async function createExercise(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
	return request('/api/exercises', {
		method: 'POST',
		data,
	});
}

export async function updateExercise(id: string, data: Partial<Exercise>): Promise<Exercise> {
	return request(`/api/exercises/${id}`, {
		method: 'PUT',
		data,
	});
}

export async function deleteExercise(id: string): Promise<void> {
	return request(`/api/exercises/${id}`, {
		method: 'DELETE',
	});
}

// ============= DASHBOARD SERVICES =============
export async function getDashboardStats(): Promise<DashboardStats> {
	try {
		return await request('/api/dashboard/stats');
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		return {
			totalWorkoutsThisMonth: 0,
			totalCaloriesBurned: 0,
			consecutiveDays: 0,
			goalCompletionPercentage: 0,
		};
	}
}

export async function getWeeklyWorkoutData(): Promise<WeeklyWorkoutData[]> {
	try {
		return await request('/api/dashboard/weekly-workouts');
	} catch (error) {
		console.error('Error fetching weekly workout data:', error);
		return [];
	}
}

export async function getWeightTrendData(): Promise<WeightTrendData[]> {
	try {
		return await request('/api/dashboard/weight-trend');
	} catch (error) {
		console.error('Error fetching weight trend:', error);
		return [];
	}
}

export async function getRecentWorkouts(limit: number = 5): Promise<WorkoutLog[]> {
	try {
		return await request('/api/dashboard/recent-workouts', {
			params: { limit },
		});
	} catch (error) {
		console.error('Error fetching recent workouts:', error);
		return [];
	}
}
